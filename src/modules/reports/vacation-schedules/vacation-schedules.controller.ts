import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { VacationSchedulesService } from './vacation-schedules.service';
import { CreateVacationScheduleDto } from './dto/create-vacation-schedule.dto';
import { UpdateVacationScheduleDto } from './dto/update-vacation-schedule.dto';
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
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('vacation-schedules')
export class VacationSchedulesController extends UniversalController<
  CreateVacationScheduleDto,
  UpdateVacationScheduleDto,
  VacationSchedulesService
> {
  constructor(service: VacationSchedulesService) {
    super(service);
  }
}







