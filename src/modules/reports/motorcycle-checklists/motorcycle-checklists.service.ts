import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CreateMotorcycleChecklistDto } from './dto/create-motorcycle-checklist.dto';
import { UpdateMotorcycleChecklistDto } from './dto/update-motorcycle-checklist.dto';
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

/**
 * Exemplo de uso do sistema de includes e transformações do UniversalService
 *
 * Este serviço demonstra como configurar automaticamente:
 * - Includes de relacionamentos (post, motorcycle)
 * - Transformações de dados (flatten de objetos aninhados)
 * - Remoção de campos desnecessários
 *
 * O sistema aplica automaticamente essas configurações em:
 * - buscarComPaginacao()
 * - criar()
 * - atualizar()
 */
@Injectable({ scope: Scope.REQUEST })
export class MotorcycleChecklistsService extends UniversalService<
  CreateMotorcycleChecklistDto,
  UpdateMotorcycleChecklistDto
> {
  private static readonly entityConfig = createEntityConfig('motorcycleChecklist');

  constructor(
    repository: UniversalRepository<
      CreateMotorcycleChecklistDto,
        UpdateMotorcycleChecklistDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private notificationHelper: NotificationHelper,
    private talaoNumberService: TalaoNumberService,
    private prisma: PrismaService,
  ) {
    const { model, casl } = MotorcycleChecklistsService.entityConfig;
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
        motorcycle: {
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
          if (data.motorcycle && data.motorcycle.plate) {
            data.motorcyclePlate = data.motorcycle.plate;
            data.motorcycleModel = data.motorcycle.model;
          }
          return data;
        },
        exclude: ['post', 'motorcycle'],
      },
    };
  }

  protected async antesDeCriar(
    data: CreateMotorcycleChecklistDto & { userId: string; talaoNumber: number },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    data.userId = user.id;
    
    // Gerar número do talão baseado na data atual (reset diário à meia-noite)
    data.talaoNumber = await this.talaoNumberService.gerarNumeroTalaoDiario(this.entityName);
  }

  protected async depoisDeCriar(data: any): Promise<void> {
    try {
      // Atualizar quilometragem atual do veículo se finalKm foi informado
      if (data.motorcycleId && data.finalKm) {
        await this.atualizarKmDoVeiculo(data.motorcycleId, data.finalKm);
      }

      // Notificar criação de checklist de motocicleta
      await this.notificationHelper.checklistMotocicletaCriado(
        data.id,
        data.userId,
        this.obterCompanyId() || '',
      );
    } catch (error) {
      console.error('Erro ao processar checklist de motocicleta criado:', error);
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateMotorcycleChecklistDto,
  ): Promise<void> {
    try {
      // Buscar o checklist atualizado para obter motorcycleId e finalKm
      const checklist = await this.buscarPorId(id);
      const checklistData = Array.isArray(checklist?.data) ? checklist.data[0] : checklist?.data;

      // Atualizar quilometragem atual do veículo se finalKm foi informado
      if (checklistData?.motorcycleId && checklistData?.finalKm) {
        await this.atualizarKmDoVeiculo(checklistData.motorcycleId, checklistData.finalKm);
      }

      // Notificar atualização de checklist de motocicleta
      const user = this.obterUsuarioLogado();
      const companyId = this.obterCompanyId() || '';

      // Verificar se foi finalizado
      if (data.status === 'RESOLVED') {
        await this.notificationHelper.checklistMotocicletaFinalizado(id, user.id, companyId);
      } else {
        await this.notificationHelper.checklistMotocicletaAtualizado(id, user.id, companyId);
      }
    } catch (error) {
      console.error('Erro ao processar checklist de motocicleta atualizado:', error);
      // Não falhar a operação principal por causa da notificação ou atualização de KM
    }
  }

  /**
   * Atualiza a quilometragem atual do veículo com o valor do finalKm do checklist
   * @param motorcycleId ID da motocicleta
   * @param finalKm Quilometragem final do checklist
   */
  private async atualizarKmDoVeiculo(motorcycleId: string | undefined, finalKm: number | undefined): Promise<void> {
    // Só atualiza se ambos os valores estiverem presentes
    if (!motorcycleId || !finalKm || finalKm <= 0) {
      return;
    }

    try {
      // Atualizar o currentKm do veículo com o finalKm do checklist
      await this.prisma.vehicle.update({
        where: { id: motorcycleId },
        data: { currentKm: finalKm },
      });

      console.log(`✅ Quilometragem atualizada para veículo ${motorcycleId}: ${finalKm} km`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar quilometragem do veículo ${motorcycleId}:`, error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }
}
