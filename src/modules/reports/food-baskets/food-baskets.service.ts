import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateFoodBasketDto } from './dto/create-food-basket.dto';
import { UpdateFoodBasketDto } from './dto/update-food-basket.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
import { FoodBasketStatus } from '@prisma/client';
import { NotificationService } from '../../notifications/shared/notification.service';
import { NotificationRecipientsService } from '../../notifications/shared/notification.recipients';

/**
 * Serviço responsável pela gestão de entregas de cesta básica
 */
@Injectable({ scope: Scope.REQUEST })
export class FoodBasketsService extends UniversalService<
  CreateFoodBasketDto,
  UpdateFoodBasketDto
> {
  private static readonly entityConfig = createEntityConfig('foodBasket');

  constructor(
    repository: UniversalRepository<CreateFoodBasketDto, UpdateFoodBasketDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
  ) {
    const { model, casl } = FoodBasketsService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );
    this.setEntityConfig();
  }

  /**
   * Configura includes e transformações específicas da entidade
   */
  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      transform: {
        flatten: {},
        custom: (data) => {
          // Adicionar employeeName se não existir (vem do relacionamento employee)
          if (data.employee && !data.employeeName) {
            data.employeeName = data.employee.name;
          }
          return data;
        },
        exclude: [],
      },
    };
  }

  /**
   * Remove campos que não existem no schema e converte datas para Date
   * Função auxiliar reutilizada em criar e atualizar
   */
  private limparDadosParaPrisma(data: any): void {
    // NOTA: employeeName NÃO deve ser removido pois é campo obrigatório no schema do FoodBasket
    // Diferente do Termination, o FoodBasket armazena employeeName diretamente no schema
    
    // Remover outros campos que possam ter sido enviados por engano
    delete data.date;
    
    // Converter strings de data para objetos Date (Prisma espera DateTime)
    // Se já for Date, mantém; se for string, converte
    if (data.withdrawalDate) {
      if (typeof data.withdrawalDate === 'string') {
        const date = new Date(data.withdrawalDate);
        if (!isNaN(date.getTime())) {
          data.withdrawalDate = date;
        }
      }
    }
    
    // Validar e converter status para enum FoodBasketStatus
    // Valores válidos: PENDING, DELIVERED, SIGNED, CANCELLED
    if (data.status !== undefined && data.status !== null) {
      const validStatuses = Object.values(FoodBasketStatus) as string[];
      let statusValue: string;
      
      if (typeof data.status === 'string') {
        statusValue = data.status.toUpperCase().trim();
      } else {
        statusValue = String(data.status).toUpperCase().trim();
      }
      
      // Verificar se é um valor válido do enum
      if (validStatuses.includes(statusValue)) {
        data.status = statusValue as FoodBasketStatus;
      } else {
        // Se status inválido, usar PENDING como padrão
        console.warn(`Status inválido recebido: "${data.status}". Convertendo para PENDING.`);
        data.status = FoodBasketStatus.PENDING;
      }
    } else if (data.status === undefined) {
      // Se status não foi fornecido, usar PENDING como padrão
      data.status = FoodBasketStatus.PENDING;
    }
  }

  /**
   * Hook executado antes de criar
   * Remove campos que não existem no schema e converte datas para Date
   */
  protected async antesDeCriar(data: CreateFoodBasketDto & { employeeId?: string; [key: string]: any }): Promise<void> {
    // employeeId será transformado automaticamente em employee: { connect: { id } }
    // pelo transformarDadosParaPrisma do UniversalRepository
    
    // NOTA: employeeName é obrigatório no schema do FoodBasket e deve ser enviado pelo frontend
    // Não removemos employeeName aqui (diferente do Termination que não tem esse campo no schema)
    
    this.limparDadosParaPrisma(data);
  }

  /**
   * Hook executado antes de atualizar
   * Remove campos que não existem no schema e converte datas para Date
   */
  protected async antesDeAtualizar(
    id: string,
    data: UpdateFoodBasketDto & { employeeId?: string; [key: string]: any },
  ): Promise<void> {
    // employeeId será transformado automaticamente em employee: { connect: { id } }
    // pelo transformarDadosParaPrisma do UniversalRepository
    
    this.limparDadosParaPrisma(data);
  }

  /**
   * Hook executado depois de criar
   * Notifica apenas administradores sobre nova entrega de cesta básica
   */
  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de food basket criado');
        return;
      }

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre food basket criado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Nova Entrega de Cesta Básica',
        message: `Entrega de cesta básica criada para ${data.employeeName || data.employee?.name || 'funcionário'}`,
        entityType: 'foodBasket',
        entityId: data.id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de food basket criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  /**
   * Hook executado depois de atualizar
   * Notifica apenas administradores sobre atualização de entrega de cesta básica
   */
  protected async depoisDeAtualizar(
    id: string,
    data: UpdateFoodBasketDto,
  ): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de food basket atualizado');
        return;
      }

      // Buscar a entidade atualizada para obter employeeName
      const resultado = await this.buscarPorId(id);
      const entity = Array.isArray(resultado?.data) ? resultado.data[0] : resultado?.data;

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre food basket atualizado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Entrega de Cesta Básica Atualizada',
        message: `Entrega de cesta básica atualizada para ${entity?.employeeName || entity?.employee?.name || 'funcionário'}`,
        entityType: 'foodBasket',
        entityId: id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de food basket atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}
