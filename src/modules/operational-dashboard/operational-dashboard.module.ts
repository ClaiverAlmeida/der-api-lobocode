import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { TenantModule } from 'src/shared/tenant/tenant.module';
import { OperationalDashboardController } from './operational-dashboard.controller';
import { OperationalDashboardService } from './operational-dashboard.service';

@Module({
  imports: [PrismaModule, TenantModule],
  controllers: [OperationalDashboardController],
  providers: [OperationalDashboardService],
})
export class OperationalDashboardModule {}

