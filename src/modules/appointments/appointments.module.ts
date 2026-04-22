import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsTaskService } from './services/appointments-task.service';

@Module({
  imports: [],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsTaskService],
  exports: [AppointmentsService, AppointmentsTaskService],
})
export class AppointmentsModule {}
