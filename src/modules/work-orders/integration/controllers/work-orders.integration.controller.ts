import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Public } from 'src/shared/auth/decorators/public.decorator';
import {
  WorkOrderIntegrationIdParamDto,
  WorkOrderIntegrationSequentialParamDto,
} from '../dto/work-orders.integration.params.dto';
import { WorkOrdersIntegrationRateLimitGuard } from '../guards/work-orders.integration-rate-limit.guard';
import { SharedTokenGuard } from '../guards/work-orders.integration.guard';
import { WorkOrdersIntegrationService } from '../services/work-orders.integration.service';

@Public()
@UseGuards(WorkOrdersIntegrationRateLimitGuard, SharedTokenGuard)
@Controller('integration/work-orders')
export class WorkOrdersIntegrationController {
  constructor(private readonly service: WorkOrdersIntegrationService) {}

  @Get()
  buscarTodos() {
    return this.service.buscarTodos();
  }

  @Get('sequential/:sequentialNumber')
  buscarPorNumeroSequencialOs(
    @Param()
    { sequentialNumber }: WorkOrderIntegrationSequentialParamDto,
  ) {
    return this.service.buscarPorCampo('sequentialNumber', sequentialNumber);
  }

  @Get(':id')
  buscarPorIdIntegracao(@Param() { id }: WorkOrderIntegrationIdParamDto) {
    return this.service.buscarPorId(id);
  }
}
