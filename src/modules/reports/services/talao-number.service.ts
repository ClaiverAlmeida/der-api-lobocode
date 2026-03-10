import { Injectable, Logger } from '@nestjs/common';
import { UniversalRepository } from '../../../shared/universal/repositories/universal.repository';
import { EntityNameModel } from '../../../shared/universal/types';

/**
 * Serviço centralizado para geração de números de talão com reset diário
 * Seguindo as regras do projeto para numeração automática
 * 
 * Foco: Evitar duplicação de números de talão com sincronização simples
 */
@Injectable()
export class TalaoNumberService {
  private readonly logger = new Logger(TalaoNumberService.name);
  
  // Lock simples para evitar concorrência
  private readonly locks = new Map<string, Promise<number>>();

  constructor(private readonly repository: UniversalRepository<any, any>) {}

  /**
   * Gera número do talão baseado na data atual (reset diário à meia-noite)
   * Foco: Evitar duplicação com sincronização simples
   * 
   * @param entityName - Nome da entidade (ex: 'occurrence', 'supply', 'motorizedService')
   * @returns Número do talão para o dia atual
   */
  async gerarNumeroTalaoDiario(entityName: EntityNameModel): Promise<number> {
    const today = new Date();
    const dateKey = this.getDateKey(today);
    const lockKey = `${entityName}-${dateKey}`;
    
    // Verificar se já existe um lock ativo
    if (this.locks.has(lockKey)) {
      this.logger.debug(`⏳ Aguardando lock para ${lockKey}`);
      return await this.locks.get(lockKey)!;
    }
    
    // Criar lock para evitar concorrência
    const lockPromise = this.generateTalaoNumber(entityName, today);
    this.locks.set(lockKey, lockPromise);
    
    try {
      const result = await lockPromise;
      return result;
    } finally {
      // Remover lock após conclusão
      this.locks.delete(lockKey);
    }
  }

  /**
   * Gera número do talão com sincronização
   */
  private async generateTalaoNumber(entityName: EntityNameModel, today: Date): Promise<number> {
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Buscar o último talão do dia atual
    const lastTalao = await this.repository.buscarMuitos(
      entityName,
      {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      {
        take: 1,
        orderBy: { talaoNumber: 'desc' }
      }
    );
    
    // Se não há talões no dia, começar do 1, senão incrementar
    const newNumber = lastTalao.length > 0 ? lastTalao[0].talaoNumber + 1 : 1;
    
    this.logger.debug(`✅ Novo número de talão gerado: ${newNumber} para ${entityName}`);
    return newNumber;
  }

  /**
   * Gera chave única para data (formato: YYYY-MM-DD)
   */
  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Limpa locks órfãos (para casos de erro)
   */
  clearOrphanedLocks(): void {
    const lockCount = this.locks.size;
    this.locks.clear();
    this.logger.warn(`🧹 Limpeza de ${lockCount} locks órfãos`);
  }

  /**
   * Obtém estatísticas simples para monitoramento
   */
  getStats(): { activeLocks: number } {
    return {
      activeLocks: this.locks.size
    };
  }
}
