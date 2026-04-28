import { Inject, Injectable, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  UniversalMetricsService,
  UniversalPermissionService,
  UniversalQueryService,
  UniversalRepository,
  UniversalService,
  createEntityConfig,
} from 'src/shared/universal';
import { CreateWorkOrderColumnDto } from '../dto/create-work-order-column.dto';
import { UpdateWorkOrderColumnDto } from '../dto/update-work-order-column.dto';

@Injectable({ scope: Scope.REQUEST })
export class WorkOrderColumnsService extends UniversalService<
  CreateWorkOrderColumnDto,
  UpdateWorkOrderColumnDto
> {
  private static readonly entityConfig = createEntityConfig('workOrderColumn');

  constructor(
    repository: UniversalRepository<
      CreateWorkOrderColumnDto,
      UpdateWorkOrderColumnDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = WorkOrderColumnsService.entityConfig;
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
      orderBy: { createdAt: 'asc' },
      includes: {
        regional: {
          select: {
            id: true,
            sgr: true,
            city: true,
          },
        },
      },
    };
  }
}
