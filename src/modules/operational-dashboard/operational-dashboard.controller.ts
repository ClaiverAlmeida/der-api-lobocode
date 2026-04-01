import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { TenantInterceptor } from 'src/shared/tenant';
import { OperationalDashboardService } from './operational-dashboard.service';

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
})
@Controller('dashboard/operational')
export class OperationalDashboardController {
  constructor(
    private readonly service: OperationalDashboardService,
  ) {}

  @Get()
  async obterResumo() {
    return this.service.obterResumoOperacional();
  }
}

