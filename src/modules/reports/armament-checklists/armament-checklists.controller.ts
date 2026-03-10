import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';

import { ArmamentChecklistsService } from './armament-checklists.service';
import { CreateArmamentChecklistDto } from './dto/create-armament-checklist.dto';
import { UpdateArmamentChecklistDto } from './dto/update-armament-checklist.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
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
@Controller('armament-checklists')
export class ArmamentChecklistsController extends UniversalController<
  CreateArmamentChecklistDto,
  UpdateArmamentChecklistDto,
  ArmamentChecklistsService
> {
  constructor(service: ArmamentChecklistsService) {
    super(service);
  }
}
