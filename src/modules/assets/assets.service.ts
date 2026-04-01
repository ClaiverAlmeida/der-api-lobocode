import { Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from 'src/shared/universal';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable({ scope: Scope.REQUEST })
export class AssetsService extends UniversalService<
  CreateAssetDto,
  UpdateAssetDto
> {
  private static readonly entityConfig = createEntityConfig('asset');

  constructor(
    repository: UniversalRepository<CreateAssetDto, UpdateAssetDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = AssetsService.entityConfig;
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
    const companyId = this.obterUsuarioLogado()?.companyId;

    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        deletedAt: null,
        ...(companyId && { companyId }),
      },
      orderBy: { createdAt: 'desc' },
    };
  }

  /**
   * Lista ativos (câmeras etc.) vinculados ao nome da rodovia,
   * garantindo que a rodovia esteja ACTIVE e NÃO deletada (soft delete).
   *
   * Como `Asset.highway` é apenas uma String (sem relação Prisma),
   * essa checagem precisa ser feita manualmente.
   */
  async buscarMuitosPorRodoviaAtiva(highwayName: string): Promise<{
    data: any[];
  }> {
    const companyId = this.obterUsuarioLogado()?.companyId;

    const highway = await this.repository.buscarPrimeiro('highway', {
      name: highwayName,
      status: 'ACTIVE',
      deletedAt: null,
      ...(companyId && { companyId }),
    });

    if (!highway) {
      return { data: [] };
    }

    return this.buscarMuitosPorCampo('highway', highwayName);
  }

  /**
   * Lista todos os assets, mas apenas os que estão vinculados a rodovias ACTIVE
   * e não deletadas.
   *
   * Observacao:
   * - `Asset.highway` eh apenas uma String (sem relacao Prisma).
   * - Por isso, a filtragem por status da rodovia precisa ser feita manualmente.
   */
  async buscarTodos(): Promise<any[]> {
    const assets = await super.buscarTodos();

    const companyId = this.obterUsuarioLogado()?.companyId;
    const activeHighways = await this.repository.buscarMuitos('highway', {
      status: 'ACTIVE',
      deletedAt: null,
      ...(companyId && { companyId }),
    });

    const activeHighwaysNames = new Set(
      activeHighways.map((h: any) => h.name),
    );

    return assets.filter((a: any) => activeHighwaysNames.has(a.highway));
  }
}

