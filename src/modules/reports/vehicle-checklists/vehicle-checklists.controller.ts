import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehicleChecklistsService } from './vehicle-checklists.service';
import { CreateVehicleChecklistDto } from './dto/create-vehicle-checklist.dto';
import { UpdateVehicleChecklistDto } from './dto/update-vehicle-checklist.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/shared/auth/guards/role.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.HR,
    Roles.SUPERVISOR,
    Roles.GUARD,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('vehicle-checklists')
export class VehicleChecklistsController extends UniversalController<
  CreateVehicleChecklistDto,
  UpdateVehicleChecklistDto,
  VehicleChecklistsService
> {
  constructor(service: VehicleChecklistsService) {
    super(service);
  }
}
