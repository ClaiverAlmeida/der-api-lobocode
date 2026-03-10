import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RequiredRoles } from 'src/shared/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { UniversalController } from 'src/shared/universal/index';
import { TenantInterceptor } from 'src/shared/tenant';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { CreateClientsDto } from './dto/create-clients.dto';
import { PatchClientsBodyDto } from './dto/patch-clients-body.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { ClientsService } from './clients.service';
import { ClientsHistoryService } from './services/clients-history.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@UseInterceptors(TenantInterceptor)
@RoleByMethod({
  GET: [
    Roles.SYSTEM_ADMIN,
    Roles.ADMIN,
    Roles.COMERCIAL,
    Roles.LOGISTICS,
    Roles.DRIVER,
  ],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.COMERCIAL],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
})
@Controller('clients')
export class ClientsController extends UniversalController<
  CreateClientsDto,
  UpdateClientsDto,
  ClientsService
> {
  constructor(
    service: ClientsService,
    private readonly clientsHistoryService: ClientsHistoryService,
  ) {
    super(service);
  }

  @Patch(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() body: UpdateClientsDto | PatchClientsBodyDto,
  ) {
    const { data, changes } = this.normalizePatchBody(body);
    return this.service.atualizar(id, data, changes);
  }

  private normalizePatchBody(body: UpdateClientsDto | PatchClientsBodyDto) {
    const isPatch = (b: unknown): b is PatchClientsBodyDto =>
      typeof b === 'object' && b !== null && 'data' in b;
    return isPatch(body)
      ? { data: body.data, changes: body.changes }
      : { data: body, changes: undefined };
  }

  @Get('export')
  async export() {
    return this.service.export();
  }

  @Get('history/:clientId')
  async getHistory(
    @Param('clientId') clientId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(String(page || '1'), 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit || '5'), 10) || 5));
    return this.clientsHistoryService.getAll(clientId, pageNum, limitNum);
  }
}
