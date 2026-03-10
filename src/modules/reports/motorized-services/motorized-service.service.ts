import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { CreateMotorizedServiceDto } from './dto/create-motorized-service.dto';
import { UpdateMotorizedServiceDto } from './dto/update-motorized-service.dto';
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
// prisma service
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class MotorizedServicesService extends UniversalService<
  CreateMotorizedServiceDto,
  UpdateMotorizedServiceDto
> {
  private static readonly entityConfig = createEntityConfig('motorizedService');

  constructor(
    repository: UniversalRepository<
      CreateMotorizedServiceDto,
      UpdateMotorizedServiceDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
    private prisma: PrismaService,
  ) {
    const { model, casl } = MotorizedServicesService.entityConfig;
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
        vehicle: {
          select: {
            plate: true,
            model: true,
          },
        },
      },

      transform: {
        flatten: {
          post: { field: 'name', target: 'postName' }, 
        },
        custom: (data) => {
          // Extrair placa do veículo se existir 
          if (data.vehicle && data.vehicle.plate) {
            data.vehiclePlate = data.vehicle.plate;
            data.vehicleModel = data.vehicle.model;
          }
          return data;
        },
        exclude: ['post', 'vehicle'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateMotorizedServiceDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Atualizar quilometragem atual do veículo se kmFinal foi informado
      if (data.vehicleId && data.kmFinal) {
        await this.atualizarKmDoVeiculo(data.vehicleId, data.kmFinal);
      }

      // Notificar criação de serviço motorizado
      await this.notificationHelper.servicoMotorizadoCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error(
        'Erro ao processar serviço motorizado criado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateMotorizedServiceDto,
  ): Promise<void> {
    try {
      // Buscar o serviço motorizado atualizado para obter vehicleId e kmFinal
      const service = await this.buscarPorId(id);
      const serviceData = Array.isArray(service?.data) ? service.data[0] : service?.data;

      // Atualizar quilometragem atual do veículo se kmFinal foi informado
      if (serviceData?.vehicleId && serviceData?.kmFinal) {
        await this.atualizarKmDoVeiculo(serviceData.vehicleId, serviceData.kmFinal);
      }

      // Notificar atualização de serviço motorizado
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.servicoMotorizadoFinalizado(
          id,
          user.id,
          companyId,
        );
      } else {
        await this.notificationHelper.servicoMotorizadoAtualizado(
          id,
          user.id,
          companyId,
        );
      }
    } catch (error) {
      console.error(
        'Erro ao processar serviço motorizado atualizado:',
        error,
      );
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  /**
   * Atualiza a quilometragem atual do veículo com o valor do kmFinal do serviço motorizado
   * @param vehicleId ID do veículo
   * @param kmFinal Quilometragem final do serviço motorizado
   */
  private async atualizarKmDoVeiculo(vehicleId: string | undefined, kmFinal: number | undefined): Promise<void> {
    // Só atualiza se ambos os valores estiverem presentes
    if (!vehicleId || !kmFinal || kmFinal <= 0) {
      return;
    }

    try {
      // Atualizar o currentKm do veículo com o kmFinal do serviço motorizado
      await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentKm: kmFinal },
      });

      console.log(`✅ Quilometragem atualizada para veículo ${vehicleId}: ${kmFinal} km`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar quilometragem do veículo ${vehicleId}:`, error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }

}
