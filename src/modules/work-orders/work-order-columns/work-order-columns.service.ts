import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  Scope,
} from '@nestjs/common';
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
        isArchived: false,
        deletedAt: null,
        ...(companyId && { companyId }),
      },
      orderBy: { sortOrder: 'asc' },
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

  protected async antesDeCriar(data: CreateWorkOrderColumnDto): Promise<void> {
    const companyId = this.obterCompanyId();
    if (!companyId) {
      throw new BadRequestException('Empresa do usuário não encontrada.');
    }

    const existingColumns = await this.reordenarSortOrderDaEmpresa(companyId);
    const maxSortOrder = existingColumns.reduce((max, column) => {
      const value =
        typeof column.sortOrder === 'number' && Number.isFinite(column.sortOrder)
          ? column.sortOrder
          : 0;
      return Math.max(max, value);
    }, 0);
    (data as any).sortOrder = maxSortOrder + 1;
  }

  protected async depoisDeCriar(): Promise<void> {
    const companyId = this.obterCompanyId();
    if (!companyId) return;
    await this.reordenarSortOrderDaEmpresa(companyId);
  }

  async antesDeDesativar(id: string) {
    const havingWorkOrders = await this.repository.buscarMuitos(
      this.entityName,
      {
        id: id,
        isArchived: false,
        deletedAt: null,
        companyId: this.obterCompanyId(),
        workOrders: { some: { columnId: id } },
      },
    );

    if (havingWorkOrders.length > 0) {
      throw new BadRequestException(
        'Não é possível desativar a coluna porque ela possui ordens de serviço associadas.',
      );
    }
  }

  protected async depoisDeDesativar(): Promise<void> {
    const companyId = this.obterCompanyId();
    if (!companyId) return;

    await this.reordenarSortOrderDaEmpresa(companyId);
  }

  private async reordenarSortOrderDaEmpresa(companyId: string) {
    const columns = await this.repository.buscarMuitos(
      this.entityName,
      {
        isArchived: false,
        deletedAt: null,
        companyId,
      },
      { orderBy: { createdAt: 'asc' } },
    );

    const ordered = [...columns].sort((left, right) => {
      const leftOrder =
        typeof left.sortOrder === 'number' && Number.isFinite(left.sortOrder)
          ? left.sortOrder
          : Number.MAX_SAFE_INTEGER;
      const rightOrder =
        typeof right.sortOrder === 'number' && Number.isFinite(right.sortOrder)
          ? right.sortOrder
          : Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return String(left.id).localeCompare(String(right.id));
    });

    await Promise.all(
      ordered.map((column, index) =>
        this.repository.atualizar(
          this.entityName,
          { id: column.id },
          { sortOrder: index + 1 } as any,
        ),
      ),
    );
    return ordered.map((column, index) => ({ ...column, sortOrder: index + 1 }));
  }
}
