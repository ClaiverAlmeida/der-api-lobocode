import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConflictError, NotFoundError } from '../../shared/common/errors';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from 'src/shared/universal/index';
import { withDateFields } from '../../shared/common/utils';
import { CreateContainersDto } from './dto/create-containers.dto';
import { UpdateContainersDto } from './dto/update-containers.dto';

const DATE_KEYS: (keyof CreateContainersDto)[] = [
  'boardingDate',
  'estimatedArrival',
];

@Injectable({ scope: Scope.REQUEST })
export class ContainersService extends UniversalService<
  CreateContainersDto,
  UpdateContainersDto
> {
  private static readonly entityConfig = createEntityConfig('container');

  constructor(
    repository: UniversalRepository<CreateContainersDto, UpdateContainersDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    private readonly prisma: PrismaService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = ContainersService.entityConfig;
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
      },
      transform: {
        flatten: {},
        exclude: [],
      },
    };
  }

  async antesDeCriar(data: CreateContainersDto) {
    if (data.number) {
      await this.validarNumeroContainerUnico(data.number);
    }
  }

  async criar(data: CreateContainersDto, include?: any, role?: Roles) {
    return super.criar(withDateFields(data, DATE_KEYS), include, role);
  }

  async antesDeAtualizar(id: string, data: UpdateContainersDto) {
    if (data.number) {
      await this.validarNumeroContainerUnico(data.number, id);
    }
  }

  async atualizar(id: string, data: UpdateContainersDto, include?: any) {
    return super.atualizar(id, withDateFields(data, DATE_KEYS), include);
  }

  private async validarNumeroContainerUnico(number: string, excludeId?: string): Promise<void> {
    const where: { number: string; id?: { not: string }; companyId?: string } = { number: number };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const companyId = this.obterUsuarioLogado()?.companyId;
    if (companyId) where.companyId = companyId;

    const container = await this.repository.buscarPrimeiro(this.entityName, where);

    if (container) {
      throw new ConflictError('Número de container já está em uso.');
    }
  }
}
