import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { CreateContainersDto } from './dto/create-containers.dto';
import { UpdateContainersDto } from './dto/update-containers.dto';
import { ContainersService } from './containers.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.FISCAL_CAMPO,
    Roles.OPERADOR,
    Roles.INSPETOR_VIA,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FISCAL_CAMPO],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FISCAL_CAMPO],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('containers')
export class ContainersController extends UniversalController<
  CreateContainersDto,
  UpdateContainersDto,
  ContainersService
> {
  constructor(service: ContainersService) {
    super(service);
  }
}
