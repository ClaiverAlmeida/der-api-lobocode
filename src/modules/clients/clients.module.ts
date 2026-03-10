import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientsHistoryService } from './services/clients-history.service';

@Module({
  imports: [],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsHistoryService],
  exports: [ClientsService, ClientsHistoryService],
})
export class ClientsModule {}
