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
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { ProductsService } from './products.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.COMERCIAL,
    Roles.LOGISTICS,
    Roles.DRIVER,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('product-prices')
export class ProductsController extends UniversalController<
  CreateProductsDto,
  UpdateProductsDto,
  ProductsService
> {
  constructor(service: ProductsService) {
    super(service);
  }
}
