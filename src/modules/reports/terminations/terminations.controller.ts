import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { TerminationsService } from './terminations.service';
import { CreateTerminationDto } from './dto/create-termination.dto';
import { UpdateTerminationDto } from './dto/update-termination.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

/**
 * Controller responsável pelos endpoints de documentos de desligamento
 */
@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('terminations')
export class TerminationsController extends UniversalController<
  CreateTerminationDto,
  UpdateTerminationDto,
  TerminationsService
> {
  constructor(service: TerminationsService) {
    super(service);
  }
}




