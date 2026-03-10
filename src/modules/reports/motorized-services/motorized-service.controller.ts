import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MotorizedServicesService } from './motorized-service.service';
import { CreateMotorizedServiceDto } from './dto/create-motorized-service.dto';
import { UpdateMotorizedServiceDto } from './dto/update-motorized-service.dto';
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
@Controller('motorized-services')
export class MotorizedServicesController extends UniversalController<
  CreateMotorizedServiceDto,
  UpdateMotorizedServiceDto,
  MotorizedServicesService
> {
  constructor(service: MotorizedServicesService) {
    super(service);
  }
}
