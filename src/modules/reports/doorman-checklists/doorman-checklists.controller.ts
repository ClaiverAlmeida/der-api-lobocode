import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { DoormanChecklistsService } from './doorman-checklists.service';
import { CreateDoormanChecklistDto } from './dto/create-doorman-checklist.dto';
import { UpdateDoormanChecklistDto } from './dto/update-doorman-checklist.dto';
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
    Roles.DOORMAN,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR, Roles.DOORMAN],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.GUARD, Roles.SUPERVISOR, Roles.DOORMAN],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('doorman-checklists')
export class DoormanChecklistsController extends UniversalController<
  CreateDoormanChecklistDto,
  UpdateDoormanChecklistDto,
  DoormanChecklistsService
> {
  constructor(service: DoormanChecklistsService) {
    super(service);
  }
}
