import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MotorcycleChecklistsService } from './motorcycle-checklists.service';
import { CreateMotorcycleChecklistDto } from './dto/create-motorcycle-checklist.dto';
import { UpdateMotorcycleChecklistDto } from './dto/update-motorcycle-checklist.dto';
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
@Controller('motorcycle-checklists')
export class MotorcycleChecklistsController extends UniversalController<
  CreateMotorcycleChecklistDto,
  UpdateMotorcycleChecklistDto,
  MotorcycleChecklistsService
> {
  constructor(service: MotorcycleChecklistsService) {
    super(service);
  }
}
