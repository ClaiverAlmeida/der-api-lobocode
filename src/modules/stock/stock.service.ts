import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError } from 'src/shared/common/errors';
import { ConflictError, NotFoundError } from 'src/shared/common/errors';
import { UpdateStockDto } from './dto/update-stock.dto';
import { DecrementStockDto } from './dto/decrement-stock.dto';
import {
  SUCCESS_MESSAGES,
  NOTIFICATION_MESSAGES,
} from 'src/shared/common/messages';

import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from 'src/shared/universal/index';
import { StockMovementDto } from './dto/stock-movement.dto';

@Injectable({ scope: Scope.REQUEST })
export class StockService extends UniversalService<
  UpdateStockDto,
  DecrementStockDto
> {
  private static readonly entityConfig = createEntityConfig('stock');

  constructor(
    repository: UniversalRepository<UpdateStockDto, DecrementStockDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = StockService.entityConfig;
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
        stockMovements: {
          select: {
            id: true,
            type: true,
            quantity: true,
            observations: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
      transform: {
        flatten: {
          // Transform
        },
      },
      where: {},
      orderBy: { updatedAt: 'desc' },
    };
  }

  async incrementarEstoque(
    id: string,
    stockUpdate?: UpdateStockDto,
    movement?: StockMovementDto,
  ) {
    const [key, value] = Object.entries(stockUpdate as any)[0];
    const data: any = {
      ...(key && value ? { [key]: { increment: value } } : {}),
      ...(movement ? { stockMovements: { create: movement } } : {}),
    };

    const includeConfig = this.getIncludeConfig();

    const updated = await this.repository.atualizar(
      this.entityName,
      { id },
      data,
      includeConfig,
    );

    return this.transformData(updated);
  }

  async decrementarEstoque(
    id: string,
    stockUpdate?: UpdateStockDto,
    movement?: StockMovementDto,
  ) {
    const [key, value] = Object.entries(stockUpdate as { [key: string]: number })[0];
    const estoqueAtualProduto = await this.repository.buscarUnico(this.entityName, { id }) as any;

    if(estoqueAtualProduto[key] < value) {
      throw new ValidationError(`Estoque insuficiente do produto ${key} para a movimentação.`);
    }

    const data: any = {
      ...(key && value ? { [key]: { decrement: value } } : {}),
      ...(movement ? { stockMovements: { create: movement } } : {}),
    };

    const includeConfig = this.getIncludeConfig();

    const updated = await this.repository.atualizar(
      this.entityName,
      { id },
      data,
      includeConfig,
    );

    return this.transformData(updated);
  }
}
