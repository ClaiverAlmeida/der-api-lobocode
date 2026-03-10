import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { FoodBasketsService } from './food-baskets.service';
import { CreateFoodBasketDto } from './dto/create-food-basket.dto';
import { UpdateFoodBasketDto } from './dto/update-food-basket.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

/**
 * Controller responsável pelos endpoints de entregas de cesta básica
 */
@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('food-baskets')
export class FoodBasketsController extends UniversalController<
  CreateFoodBasketDto,
  UpdateFoodBasketDto,
  FoodBasketsService
> {
  constructor(service: FoodBasketsService) {
    super(service);
  }
}
