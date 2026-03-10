import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { DisciplinaryWarningsService } from './disciplinary-warnings.service';
import { CreateDisciplinaryWarningDto } from './dto/create-disciplinary-warning.dto';
import { UpdateDisciplinaryWarningDto } from './dto/update-disciplinary-warning.dto';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { Roles } from '@prisma/client';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant/tenant.interceptor';
import { UniversalController } from 'src/shared/universal';

/**
 * Controller responsável pelos endpoints de cartas de advertência disciplinar
 */
@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.HR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('disciplinary-warnings')
export class DisciplinaryWarningsController extends UniversalController<
  CreateDisciplinaryWarningDto,
  UpdateDisciplinaryWarningDto,
  DisciplinaryWarningsService
> {
  constructor(service: DisciplinaryWarningsService) {
    super(service);
  }
}
