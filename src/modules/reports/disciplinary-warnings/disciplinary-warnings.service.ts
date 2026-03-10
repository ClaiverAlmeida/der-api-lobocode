import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateDisciplinaryWarningDto } from './dto/create-disciplinary-warning.dto';
import { UpdateDisciplinaryWarningDto } from './dto/update-disciplinary-warning.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
import { DisciplinaryWarningStatus } from '@prisma/client';
import { NotificationService } from '../../notifications/shared/notification.service';
import { NotificationRecipientsService } from '../../notifications/shared/notification.recipients';

/**
 * Serviço responsável pela gestão de cartas de advertência disciplinar
 */
@Injectable({ scope: Scope.REQUEST })
export class DisciplinaryWarningsService extends UniversalService<
  CreateDisciplinaryWarningDto,
  UpdateDisciplinaryWarningDto
> {
  private static readonly entityConfig = createEntityConfig('disciplinaryWarning');

  constructor(
    repository: UniversalRepository<CreateDisciplinaryWarningDto, UpdateDisciplinaryWarningDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
  ) {
    const { model, casl } = DisciplinaryWarningsService.entityConfig;
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
            address: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            cpf: true,
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
    // Remover campos que não existem no schema do Prisma
    // employeeName é usado apenas para validação no DTO, mas não existe no schema
    // (vem do relacionamento employee.name)
    delete data.employeeName;
    
    // Remover outros campos que possam ter sido enviados por engano
    delete data.date;
    
    // Converter strings de data para objetos Date (Prisma espera DateTime)
    // Se já for Date, mantém; se for string, converte
    if (data.warningDate) {
      if (typeof data.warningDate === 'string') {
        const date = new Date(data.warningDate);
        if (!isNaN(date.getTime())) {
          data.warningDate = date;
        }
      }
    }
    
    // Validar e converter status para enum DisciplinaryWarningStatus
    // Valores válidos: DRAFT, SENT, SIGNED, CANCELLED
    if (data.status !== undefined && data.status !== null) {
      const validStatuses = Object.values(DisciplinaryWarningStatus) as string[];
      let statusValue: string;
      
      if (typeof data.status === 'string') {
        statusValue = data.status.toUpperCase().trim();
      } else {
        statusValue = String(data.status).toUpperCase().trim();
      }
      
      // Verificar se é um valor válido do enum
      if (validStatuses.includes(statusValue)) {
        data.status = statusValue as DisciplinaryWarningStatus;
      } else {
        // Se status inválido, usar DRAFT como padrão
        console.warn(`Status inválido recebido: "${data.status}". Convertendo para DRAFT.`);
        data.status = DisciplinaryWarningStatus.DRAFT;
      }
    } else if (data.status === undefined) {
      // Se status não foi fornecido, usar DRAFT como padrão
      data.status = DisciplinaryWarningStatus.DRAFT;
    }
  }

  /**
   * Hook executado antes de criar
   * Remove campos que não existem no schema e converte datas para Date
   */
  protected async antesDeCriar(data: CreateDisciplinaryWarningDto & { employeeId?: string; [key: string]: any }): Promise<void> {
    // employeeId será transformado automaticamente em employee: { connect: { id } }
    // pelo transformarDadosParaPrisma do UniversalRepository
    
    this.limparDadosParaPrisma(data);
  }

  /**
   * Hook executado antes de atualizar
   * Remove campos que não existem no schema e converte datas para Date
   */
  protected async antesDeAtualizar(
    id: string,
    data: UpdateDisciplinaryWarningDto & { employeeId?: string; [key: string]: any },
  ): Promise<void> {
    // employeeId será transformado automaticamente em employee: { connect: { id } }
    // pelo transformarDadosParaPrisma do UniversalRepository
    
    this.limparDadosParaPrisma(data);
  }

  /**
   * Hook executado depois de criar
   * Notifica apenas administradores sobre nova advertência disciplinar
   */
  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de disciplinary warning criado');
        return;
      }

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre disciplinary warning criado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Nova Advertência Disciplinar',
        message: `Advertência disciplinar criada para ${data.employeeName || data.employee?.name || 'funcionário'}`,
        entityType: 'disciplinaryWarning',
        entityId: data.id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de disciplinary warning criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  /**
   * Hook executado depois de atualizar
   * Notifica apenas administradores sobre atualização de advertência disciplinar
   */
  protected async depoisDeAtualizar(
    id: string,
    data: UpdateDisciplinaryWarningDto,
  ): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de disciplinary warning atualizado');
        return;
      }

      // Buscar a entidade atualizada para obter employeeName
      const resultado = await this.buscarPorId(id);
      const entity = Array.isArray(resultado?.data) ? resultado.data[0] : resultado?.data;

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre disciplinary warning atualizado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Advertência Disciplinar Atualizada',
        message: `Advertência disciplinar atualizada para ${entity?.employeeName || entity?.employee?.name || 'funcionário'}`,
        entityType: 'disciplinaryWarning',
        entityId: id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de disciplinary warning atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}
