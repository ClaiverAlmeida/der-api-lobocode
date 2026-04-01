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
import { Roles, UserStatus } from '@prisma/client';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';

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
@Controller('hr/users')
export class UsersController extends UniversalController<
  CreateUsersDto,
  UpdateUsersDto,
  UsersService
> {
  constructor(service: UsersService) {
    super(service);
  }

  // @Post('system-admin')
  // criarNovoSystemAdmin(@Body() dto: CreateSystemAdminDto) {
  //   return this.service.criarNovoSystemAdmin(dto);
  // }

  @Get('drivers')
  @RequiredRoles(Roles.ADMIN, Roles.FISCAL_CAMPO, Roles.OPERADOR, Roles.INSPETOR_VIA)
  buscarMuitosPorCampos() {
    return this.service.buscarMuitosPorCampos({ role: Roles.INSPETOR_VIA, status: UserStatus.ACTIVE });
  }
}
