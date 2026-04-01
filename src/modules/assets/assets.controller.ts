import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { AuthGuard } from 'src/shared/auth/guards/auth.guard';
import { RoleByMethodGuard } from 'src/shared/auth/guards/role-by-method.guard';
import { RoleByMethod } from 'src/shared/auth/role-by-method.decorator';
import { UniversalController } from 'src/shared/universal';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetsService } from './assets.service';

@UseGuards(AuthGuard, RoleByMethodGuard)
@RoleByMethod({
  GET: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.FISCAL_CAMPO, Roles.OPERADOR, Roles.INSPETOR_VIA],
  POST: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.OPERADOR],
  PATCH: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.OPERADOR],
  DELETE: [Roles.SYSTEM_ADMIN, Roles.ADMIN, Roles.OPERADOR],
})
@Controller('assets')
export class AssetsController extends UniversalController<
  CreateAssetDto,
  UpdateAssetDto,
  AssetsService
> {
  constructor(service: AssetsService) {
    super(service);
  }

  /**
   * Lista todos os ativos vinculados a uma rodovia pelo nome exato
   */
  @Get('highway/:highway')
  async buscarPorRodovia(@Param('highway') highway: string) {
    return this.service.buscarMuitosPorRodoviaAtiva(highway);
  }

  /**
   * Lista ativos por tipo (CAMERA, SENSOR, EQUIPMENT)
   */
  @Get('by-type/:type')
  async buscarPorTipo(@Param('type') type: string) {
    return this.service.buscarMuitosPorCampo('type', type);
  }

  /**
   * Reativa um ativo desativado
   */
  @Post(':id/restore')
  async reativar(@Param('id') id: string) {
    return this.service.reativar(id);
  }
}
