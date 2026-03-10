import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../shared/common/errors';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from 'src/shared/universal/index';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { withDateFields } from 'src/shared/common/utils';

const DATE_KEYS: (keyof CreateUsersDto)[] = ['birthDate', 'hireDate', 'terminationDate'];

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends UniversalService<
  CreateUsersDto,
  UpdateUsersDto
> {
  private static readonly entityConfig = createEntityConfig('user');


  constructor(
    repository: UniversalRepository<CreateUsersDto, UpdateUsersDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    private readonly prisma: PrismaService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = UsersService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );

    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
      },
      transform: {
        flatten: {},
        exclude: ['password', 'login'],
      },
      where: {
        role: {
          notIn: [Roles.SYSTEM_ADMIN, Roles.ADMIN],
        },
      }
    };
  }

  // TODO - Senha, Role, verificar permissões de acordo com a role, validar campos unicos, retirar ADMIN do frontend
  
  async antesDeCriar(data: CreateUsersDto): Promise<void> {
    if (data.role === Roles.SYSTEM_ADMIN) throw new ForbiddenError('Não é possível criar um usuário com o papel de SYSTEM_ADMIN.');
    if (data.cpf) await this.validarCPFUnico(data.cpf);
  }

  async criar(data: CreateUsersDto, include?: any, role?: Roles) {
    return super.criar(withDateFields(data, DATE_KEYS), include, role);
  }

  async antesDeAtualizar(id, data: UpdateUsersDto): Promise<void> {
    if (data.role === Roles.SYSTEM_ADMIN) throw new ForbiddenError('Não é possível criar um usuário com o papel de SYSTEM_ADMIN.');
    if (data.cpf) await this.validarCPFUnico(id, data.cpf);
  }

  async atualizar(id: string, data: UpdateUsersDto, include?: any) {
    return super.atualizar(id, withDateFields(data, DATE_KEYS), include);
  }

  private async validarCPFUnico(
    cpf: string,
    excludeEmployeeId?: string,
  ): Promise<void> {
    const where: { cpf: string; id?: { not: string }; companyId?: string } =
      { cpf: cpf };
    if (excludeEmployeeId) {
      where.id = { not: excludeEmployeeId };
    }
    const companyId = this.obterUsuarioLogado()?.companyId;
    if (companyId) where.companyId = companyId;
    const existente = await this.repository.buscarPrimeiro(
      this.entityName,
      where,
    );
    if (existente) {
      throw new ConflictError('CPF já está em uso por outro usuário.');
    }
  }
}
