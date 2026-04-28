import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant';
import { CreateWorkOrderPauseHistoryDto } from '../dto/create-work-order-pause-history.dto';
import { WorkOrderPauseHistoryService } from './work-order-pause-history.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FIELD_TEAM, Roles.C2C],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FIELD_TEAM, Roles.C2C],
})
@Controller('work-orders/:workOrderId/pause-history')
export class WorkOrderPauseHistoryController {
  constructor(
    private readonly workOrderPauseHistoryService: WorkOrderPauseHistoryService,
  ) {}

  @Get()
  async listar(@Param('workOrderId') workOrderId: string) {
    return this.workOrderPauseHistoryService.listByWorkOrderId(workOrderId);
  }

  @Patch('pause')
  async pausar(
    @Param('workOrderId') workOrderId: string,
    @Body() body: CreateWorkOrderPauseHistoryDto,
  ) {
    return this.workOrderPauseHistoryService.pause(workOrderId, body);
  }

  @Patch('resume')
  async retomar(@Param('workOrderId') workOrderId: string) {
    return this.workOrderPauseHistoryService.resume(workOrderId);
  }
}
