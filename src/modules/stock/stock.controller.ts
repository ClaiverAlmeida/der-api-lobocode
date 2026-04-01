import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UpdateStockDto } from './dto/update-stock.dto';
import { DecrementStockDto } from './dto/decrement-stock.dto';
import { StockService } from './stock.service';
import { PatchStockBodyDto } from './dto/patch-stock-body.dto';

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
@Controller('stock')
export class StockController extends UniversalController<
  UpdateStockDto,
  DecrementStockDto,
  StockService
> {
  constructor(service: StockService) {
    super(service);
  }

  @Patch('/increment/:id')
  async incrementarEstoque(
    @Param('id') id: string,
    @Body() body: PatchStockBodyDto,
  ) {
    const stock = this.stripUndefined(body.stock);
    const movement = this.stripUndefined(body.movement);
    return this.service.incrementarEstoque(id, stock, movement);
  }

  @Patch('/decrement/:id')
  async decrementarEstoque(
    @Param('id') id: string,
    @Body() body: PatchStockBodyDto,
  ) {
    const stock = this.stripUndefined(body.stock);
    const movement = this.stripUndefined(body.movement);
    return this.service.decrementarEstoque(id, stock, movement);
  }

  private stripUndefined<T extends object>(obj?: T): T | undefined {
    if (!obj) return undefined;
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined),
    ) as T;
  }
}
