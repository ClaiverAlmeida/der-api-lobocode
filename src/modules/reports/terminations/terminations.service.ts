import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateTerminationDto } from './dto/create-termination.dto';
import { UpdateTerminationDto } from './dto/update-termination.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
import { TerminationStatus } from '@prisma/client';
import { NotificationService } from '../../notifications/shared/notification.service';
import { NotificationRecipientsService } from '../../notifications/shared/notification.recipients';

/**
 * Serviço responsável pela gestão de documentos de desligamento
 */
@Injectable({ scope: Scope.REQUEST })
export class TerminationsService extends UniversalService<
  CreateTerminationDto,
  UpdateTerminationDto
> {
  private static readonly entityConfig = createEntityConfig('termination');

  constructor(
    repository: UniversalRepository<CreateTerminationDto, UpdateTerminationDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
  ) {
    const { model, casl } = TerminationsService.entityConfig;
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
    // Remover campos que não existem no schema do Prisma
    // employeeName é usado apenas para validação no DTO, mas não existe no schema
    // (vem do relacionamento employee.name)
    delete data.employeeName;

    // Remover outros campos que possam ter sido enviados por engano
    delete data.date;

    // Converter strings de data para objetos Date (Prisma espera DateTime)
    // Se já for Date, mantém; se for string, converte
    if (data.admissionDate) {
      if (typeof data.admissionDate === 'string') {
        const date = new Date(data.admissionDate);
        if (!isNaN(date.getTime())) {
          data.admissionDate = date;
        }
      }
    }

    if (data.terminationDate) {
      if (typeof data.terminationDate === 'string') {
        const date = new Date(data.terminationDate);
        if (!isNaN(date.getTime())) {
          data.terminationDate = date;
        }
      }
    }

    // Validar e converter status para enum TerminationStatus
    // Valores válidos: DRAFT, SENT, SIGNED, CANCELLED
    if (data.status !== undefined && data.status !== null) {
      const validStatuses = Object.values(TerminationStatus) as string[];
      let statusValue: string;

      if (typeof data.status === 'string') {
        statusValue = data.status.toUpperCase().trim();
      } else {
        statusValue = String(data.status).toUpperCase().trim();
      }

      // Verificar se é um valor válido do enum
      if (validStatuses.includes(statusValue)) {
        data.status = statusValue as TerminationStatus;
      } else {
        // Se status inválido (ex: "PENDING"), usar DRAFT como padrão
        console.warn(`Status inválido recebido: "${data.status}". Convertendo para DRAFT.`);
        data.status = TerminationStatus.DRAFT;
      }
    } else if (data.status === undefined) {
      // Se status não foi fornecido, usar DRAFT como padrão
      data.status = TerminationStatus.DRAFT;
    }
  }

  /**
   * Hook executado antes de criar
   * Remove campos que não existem no schema e converte datas para Date
   */
  protected async antesDeCriar(data: CreateTerminationDto & { employeeId?: string;[key: string]: any }): Promise<void> {
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
    data: UpdateTerminationDto & { employeeId?: string;[key: string]: any },
  ): Promise<void> {
    // employeeId será transformado automaticamente em employee: { connect: { id } }
    // pelo transformarDadosParaPrisma do UniversalRepository

    this.limparDadosParaPrisma(data);
  }

  /**
   * Hook executado depois de criar
   * Notifica apenas administradores sobre novo documento de desligamento
   */
  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();

      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de termination criado');
        return;
      }

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre termination criado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Novo Documento de Desligamento',
        message: `Documento de desligamento criado para ${data.employeeName || 'funcionário'}`,
        entityType: 'termination',
        entityId: data.id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de termination criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  /**
   * Hook executado depois de atualizar
   * Notifica apenas administradores sobre atualização de documento de desligamento
   */
  protected async depoisDeAtualizar(
    id: string,
    data: UpdateTerminationDto,
  ): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();

      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de termination atualizado');
        return;
      }

      // Buscar a entidade atualizada para obter employeeName
      const resultado = await this.buscarPorId(id);
      const entity = Array.isArray(resultado?.data) ? resultado.data[0] : resultado?.data;

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre termination atualizado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Documento de Desligamento Atualizado',
        message: `Documento de desligamento atualizado para ${entity?.employeeName || entity?.employee?.name || 'funcionário'}`,
        entityType: 'termination',
        entityId: id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de termination atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}

