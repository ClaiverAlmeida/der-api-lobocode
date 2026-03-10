import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
// universal imports
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../../shared/universal/index';
// notification imports
import { NotificationHelper } from '../../notifications/notification.helper';
// talao service
import { TalaoNumberService } from '../services/talao-number.service';

@Injectable({ scope: Scope.REQUEST })
export class OccurrencesService extends UniversalService<
  CreateOccurrenceDto,
  UpdateOccurrenceDto
> {
  private static readonly entityConfig = createEntityConfig('occurrence');

  constructor(
    repository: UniversalRepository<CreateOccurrenceDto, UpdateOccurrenceDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = OccurrencesService.entityConfig;
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
        post: {
          select: {
            name: true,
          },
        },
        occurrenceDispatch: {
          select: {
            talaoNumber: true,
            occurrenceAddress: true,
            applicant: true,
            id: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
        },
        custom: (data) => {
          if (data.occurrenceDispatch) {
            data.occurrenceDispatchName = `#${data.occurrenceDispatch.talaoNumber} - ${data.occurrenceDispatch.applicant} - ${data.occurrenceDispatch.occurrenceAddress}`;
            data.occurrenceDispatchId = data.occurrenceDispatch.id;
          }
          return data;
        },
        exclude: ['post', 'occurrenceDispatch'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateOccurrenceDto & { userId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
    
    if (!data.occurrenceDispatchId) delete data.occurrenceDispatchId;
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de ocorrência
      await this.notificationHelper.ocorrenciaCriada(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de ocorrência criada:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }


  protected async depoisDeAtualizar(
    id: string,
    data: UpdateOccurrenceDto,
  ): Promise<void> {
    try {
      // Notificar atualização de ocorrência
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi resolvida
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.ocorrenciaResolvida(
          id,
          user.id,
          companyId,
        );
      } else {
        await this.notificationHelper.ocorrenciaAtualizada(
          id,
          user.id,
          companyId,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de ocorrência atualizada:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }
}
