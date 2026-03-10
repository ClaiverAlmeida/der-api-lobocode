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
}

