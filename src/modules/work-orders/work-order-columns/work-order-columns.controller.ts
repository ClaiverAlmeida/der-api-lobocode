import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant';
import { UniversalController } from 'src/shared/universal';
import { CreateWorkOrderColumnDto } from '../dto/create-work-order-column.dto';
import { UpdateWorkOrderColumnDto } from '../dto/update-work-order-column.dto';
import { WorkOrderColumnsService } from './work-order-columns.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.FIELD_TEAM,
    Roles.C2C,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('work-order-columns')
export class WorkOrderColumnsController extends UniversalController<
  CreateWorkOrderColumnDto,
  UpdateWorkOrderColumnDto,
  WorkOrderColumnsService
> {
  constructor(service: WorkOrderColumnsService) {
    super(service);
  }
}
