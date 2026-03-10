import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ClientsHistoryService } from '../clients/services/clients-history.service';
import { AppointmentsTaskService } from './services/appointments-task.service';

@Module({
  imports: [],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ClientsHistoryService, AppointmentsTaskService],
  exports: [AppointmentsService, ClientsHistoryService, AppointmentsTaskService],
})
export class AppointmentsModule {}
