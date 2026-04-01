import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto';
import { UpdateDeliveryPriceDto } from './dto/update-delivery-price.dto';
import { DeliveryPricesService } from './delivery.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.FISCAL_CAMPO,
    Roles.OPERADOR,
    Roles.INSPETOR_VIA,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FISCAL_CAMPO],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FISCAL_CAMPO],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('delivery-prices')
export class DeliveryPricesController extends UniversalController<
  CreateDeliveryPriceDto,
  UpdateDeliveryPriceDto,
  DeliveryPricesService
> {
  constructor(service: DeliveryPricesService) {
    super(service);
  }
}
