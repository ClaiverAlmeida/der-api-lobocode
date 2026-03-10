import { Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConflictError } from '../../shared/common/errors';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal';
import { CreateHighwayDto } from './dto/create-highway.dto';
import { UpdateHighwayDto } from './dto/update-highway.dto';

@Injectable({ scope: Scope.REQUEST })
export class HighwaysService extends UniversalService<
  CreateHighwayDto,
  UpdateHighwayDto
> {
  private static readonly entityConfig = createEntityConfig('highway');

  constructor(
    repository: UniversalRepository<CreateHighwayDto, UpdateHighwayDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = HighwaysService.entityConfig;
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
      where: {
        deletedAt: null,
        ...(companyId && { companyId }),
      },
      orderBy: { name: 'asc' },
    };
  }

  protected async antesDeCriar(data: CreateHighwayDto): Promise<void> {
    const companyId = this.obterUsuarioLogado()?.companyId;

    if (companyId && !data.companyId) {
      data.companyId = companyId;
    }

    if (data.code) {
      const isUnique = await this.validarSeEhUnico('code', data.code);
      if (!isUnique) {
        throw new ConflictError('Código da rodovia já está em uso');
      }
    }
  }

  protected async antesDeAtualizar(
    id: string,
    data: UpdateHighwayDto,
  ): Promise<void> {
    if (data.code) {
      const isUnique = await this.validarSeEhUnico('code', data.code, id);
      if (!isUnique) {
        throw new ConflictError('Código da rodovia já está em uso');
      }
    }
  }
}

