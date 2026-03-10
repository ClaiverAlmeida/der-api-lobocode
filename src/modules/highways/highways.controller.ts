import { Body, Controller, UseGuards } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';
import { CreateHighwayDto } from './dto/create-highway.dto';
import { UpdateHighwayDto } from './dto/update-highway.dto';
import { HighwaysService } from './highways.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.COMERCIAL,
    Roles.LOGISTICS,
    Roles.DRIVER,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL, Roles.LOGISTICS],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL, Roles.LOGISTICS],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('highways')
export class HighwaysController extends UniversalController<
  CreateHighwayDto,
  UpdateHighwayDto,
  HighwaysService
> {
  constructor(service: HighwaysService) {
    super(service);
  }
}

