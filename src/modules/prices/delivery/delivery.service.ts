import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError } from 'src/shared/common/errors';
import { ConflictError, NotFoundError } from 'src/shared/common/errors';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';
import { UpdateDeliveryPriceDto } from './dto/update-delivery-price.dto';
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

@Injectable({ scope: Scope.REQUEST })
export class DeliveryPricesService extends UniversalService<
  CreateDeliveryPriceDto,
  UpdateDeliveryPriceDto
> {
  private static readonly entityConfig = createEntityConfig('deliveryPrice');

  constructor(
    repository: UniversalRepository<
      CreateDeliveryPriceDto,
      UpdateDeliveryPriceDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = DeliveryPricesService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );
  }
}
