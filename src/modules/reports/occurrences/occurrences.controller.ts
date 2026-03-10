import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { OccurrencesService } from './occurrences.service';
import { CreateOccurrenceDto } from './dto/create-occurrence.dto';
import { UpdateOccurrenceDto } from './dto/update-occurrence.dto';
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
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  ],
  POST: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.GUARD,
    Roles.SUPERVISOR,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  ],
  PATCH: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.GUARD,
    Roles.SUPERVISOR,
    Roles.DOORMAN,
    Roles.JARDINER,
    Roles.MAINTENANCE_ASSISTANT,
    Roles.MONITORING_OPERATOR,
    Roles.ADMINISTRATIVE_ASSISTANT,
  ],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('occurrences')
export class OccurrencesController extends UniversalController<
  CreateOccurrenceDto,
  UpdateOccurrenceDto,
  OccurrencesService
> {
  constructor(service: OccurrencesService) {
    super(service);
  }
}
