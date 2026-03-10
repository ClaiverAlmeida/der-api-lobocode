import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateArmamentChecklistDto } from './dto/create-armament-checklist.dto';
import { UpdateArmamentChecklistDto } from './dto/update-armament-checklist.dto';
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

/**
 * Serviço para gerenciamento de checklists de armamento
 * Seguindo exatamente a mesma lógica dos outros serviços do sistema
 */
@Injectable({ scope: Scope.REQUEST })
export class ArmamentChecklistsService extends UniversalService<
  CreateArmamentChecklistDto,
  UpdateArmamentChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('armamentChecklist');

  constructor(
    repository: UniversalRepository<
      CreateArmamentChecklistDto,
      UpdateArmamentChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
  ) {
    const { model, casl } = ArmamentChecklistsService.entityConfig;
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
        user: {
          select: {
            name: true,
          },
        },
      },
      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' },
          user: { field: 'name', target: 'userName' },
        },
        exclude: ['post', 'user'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateArmamentChecklistDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Notificar criação de checklist de armamento
      await this.notificationHelper.checklistArmamentoCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de checklist de armamento criado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateArmamentChecklistDto,
  ): Promise<void> {
    try {
      // Notificar atualização de checklist de armamento
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.checklistArmamentoFinalizado(id, user.id, companyId);
      } else {
        await this.notificationHelper.checklistArmamentoAtualizado(id, user.id, companyId);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de checklist de armamento atualizado:', error);
      // Não falhar a operação principal por causa da notificação
    }
  }
}
