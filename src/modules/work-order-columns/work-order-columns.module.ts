import { Module } from '@nestjs/common';
import { WorkOrderColumnsController } from './work-order-columns.controller';
import { WorkOrderColumnsService } from './work-order-columns.service';

@Module({
  controllers: [WorkOrderColumnsController],
  providers: [WorkOrderColumnsService],
  exports: [WorkOrderColumnsService],
})
export class WorkOrderColumnsModule {}
