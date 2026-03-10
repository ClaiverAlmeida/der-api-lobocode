import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateOccurrenceDispatchDto } from './dto/create-occurrences-dispatches.dto';
import { UpdateOccurrenceDispatchDto } from './dto/update-occurrences-dispatches.dto';
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
export class OccurrencesDispatchesService extends UniversalService<
  CreateOccurrenceDispatchDto,
  UpdateOccurrenceDispatchDto
> {
  private static readonly entityConfig =
    createEntityConfig('occurrenceDispatch');

  constructor(
    repository: UniversalRepository<
      CreateOccurrenceDispatchDto,
      UpdateOccurrenceDispatchDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = OccurrencesDispatchesService.entityConfig;
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
        guard: {
          select: {
            name: true,
          },
        },
        occurrences: {
          select: {
            talaoNumber: true,
            id: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          guard: { field: 'name', target: 'guardName' },
        },
        custom: (data) => {
          data.name = `#${data.talaoNumber} - ${data.applicant} - ${data.occurrenceAddress}`;

          
          return data;
        },
        exclude: ['post', 'guard'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateOccurrenceDispatchDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de despacho de ocorrência
      await this.notificationHelper.despachoOcorrenciaCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de despacho de ocorrência criado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateOccurrenceDispatchDto,
  ): Promise<void> {
    try {
      // Notificar atualização de despacho de ocorrência
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.despachoOcorrenciaFinalizado(
          id,
          user.id,
          companyId,
        );
      } else {
        await this.notificationHelper.despachoOcorrenciaAtualizado(
          id,
          user.id,
          companyId,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao enviar notificação de despacho de ocorrência atualizado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação
    }
  }
}
