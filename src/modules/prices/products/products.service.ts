import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError } from 'src/shared/common/errors';
import { ConflictError, NotFoundError } from 'src/shared/common/errors';
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

import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
@Injectable({ scope: Scope.REQUEST })
export class ProductsService extends UniversalService<
  CreateProductsDto,
  UpdateProductsDto
> {
  private static readonly entityConfig = createEntityConfig('productPrice');

  constructor(
    repository: UniversalRepository<CreateProductsDto, UpdateProductsDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = ProductsService.entityConfig;
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
      transform: {
        flatten: {
          // Transform
        },
        // exclude: ['post', 'company'],
      },
    };
  }
}
