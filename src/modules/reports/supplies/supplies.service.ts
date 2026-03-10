import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
// dto imports
import { Supply } from '@prisma/client';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
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
export class SuppliesService extends UniversalService<
  CreateSupplyDto,
  UpdateSupplyDto
> {
  private static readonly entityConfig = createEntityConfig('supply');

  constructor(
    repository: UniversalRepository<CreateSupplyDto, UpdateSupplyDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
    private prisma: PrismaService,
  ) {
    const { model, casl } = SuppliesService.entityConfig;
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
    data: CreateSupplyDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: Supply): Promise<void> {
    try {
      // Atualizar quilometragem atual do veículo se kmReturn foi informado
      if (data.vehicleId && data.kmReturn) {
        await this.atualizarKmDoVeiculo(data.vehicleId, data.kmReturn);
      }

      // Notificar criação de suprimento com ID real
      await this.notificationHelper.supplyCriado(
        data.id, // ✅ ID real do supply criado
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao processar supply criado:', error);
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateSupplyDto,
  ): Promise<void> {
    try {
      // Buscar o supply atualizado para obter vehicleId e kmReturn
      const supply = await this.buscarPorId(id);
      const supplyData = Array.isArray(supply?.data) ? supply.data[0] : supply?.data;

      // Atualizar quilometragem atual do veículo se kmReturn foi informado
      if (supplyData?.vehicleId && supplyData?.kmReturn) {
        await this.atualizarKmDoVeiculo(supplyData.vehicleId, supplyData.kmReturn);
      }

      // Notificar atualização de abastecimento
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      if (data.status === 'RESOLVED') {
        await this.notificationHelper.supplyFinalizado(id, user.id, companyId);
      } else {
        await this.notificationHelper.supplyAtualizado(id, user.id, companyId);
      }
    } catch (error) {
      console.error('Erro ao processar supply atualizado:', error);
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  /**
   * Atualiza a quilometragem atual do veículo com o valor do kmReturn do supply
   * @param vehicleId ID do veículo
   * @param kmReturn Quilometragem de retorno do supply
   */
  private async atualizarKmDoVeiculo(vehicleId: string | undefined, kmReturn: number | undefined): Promise<void> {
    // Só atualiza se ambos os valores estiverem presentes
    if (!vehicleId || !kmReturn || kmReturn <= 0) {
      return;
    }

    try {
      // Atualizar o currentKm do veículo com o kmReturn do supply
      await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentKm: kmReturn },
      });

      console.log(`✅ Quilometragem atualizada para veículo ${vehicleId}: ${kmReturn} km`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar quilometragem do veículo ${vehicleId}:`, error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }

}
