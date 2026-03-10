import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { VacationSchedule } from '@prisma/client';
import { CreateVacationScheduleDto } from './dto/create-vacation-schedule.dto';
import { UpdateVacationScheduleDto } from './dto/update-vacation-schedule.dto';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
import { NotificationService } from '../../notifications/shared/notification.service';
import { NotificationRecipientsService } from '../../notifications/shared/notification.recipients';

@Injectable({ scope: Scope.REQUEST })
export class VacationSchedulesService extends UniversalService<
  CreateVacationScheduleDto,
  UpdateVacationScheduleDto
> {
  private static readonly entityConfig = createEntityConfig('vacationSchedule');

  constructor(
    repository: UniversalRepository<CreateVacationScheduleDto, UpdateVacationScheduleDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationService: NotificationService,
    private recipientsService: NotificationRecipientsService,
  ) {
    const { model, casl } = VacationSchedulesService.entityConfig;
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

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        employee: {
          select: {
            name: true,
          },
        },
      },
      transform: {
        flatten: {},
        custom: (data) => {
          if (data?.employee) {
            data.employeeName = data.employee.name;
          }
          return data;
        },
        exclude: ['employee'],
      },
    };
  }

  /**
   * Hook executado depois de criar
   * Notifica apenas administradores sobre nova escala de férias
   */
  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de vacation schedule criado');
        return;
      }

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre vacation schedule criado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Nova Escala de Férias',
        message: `Escala de férias criada para ${data.employeeName || data.employee?.name || 'funcionário'} - Ano ${data.year || 'N/A'}`,
        entityType: 'vacationSchedule',
        entityId: data.id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de vacation schedule criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  /**
   * Hook executado depois de atualizar
   * Notifica apenas administradores sobre atualização de escala de férias
   */
  protected async depoisDeAtualizar(
    id: string,
    data: UpdateVacationScheduleDto,
  ): Promise<void> {
    try {
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId();
      
      if (!companyId) {
        console.warn('CompanyId não encontrado para notificação de vacation schedule atualizado');
        return;
      }

      // Buscar a entidade atualizada para obter employeeName e year
      const resultado = await this.buscarPorId(id);
      const entity = Array.isArray(resultado?.data) ? resultado.data[0] : resultado?.data;

      // Obter apenas administradores
      const adminIds = await this.recipientsService.getRecipients(companyId, 'ADMINS_ONLY');

      if (adminIds.length === 0) {
        console.warn('Nenhum administrador encontrado para notificar sobre vacation schedule atualizado');
        return;
      }

      // Criar notificação
      await this.notificationService.criar({
        title: 'Escala de Férias Atualizada',
        message: `Escala de férias atualizada para ${entity?.employeeName || entity?.employee?.name || 'funcionário'} - Ano ${entity?.year || 'N/A'}`,
        entityType: 'vacationSchedule',
        entityId: id,
        userId: user.id,
        companyId,
        recipients: adminIds,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de vacation schedule atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}

