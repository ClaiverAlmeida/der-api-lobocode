import { Injectable } from '@nestjs/common';
import { CreateSupervisorDto } from '../dto/create-supervisor.dto';
import { BaseUserService } from './base-user.service';
import { UserFactory } from '../factories/user.factory';
import { UserRepository } from '../repositories/user.repository';
import { UserValidator } from '../validators/user.validator';
import { UserQueryService } from './user-query.service';
import { ForbiddenError } from '../../../shared/common/errors';
import { ERROR_MESSAGES } from '../../../shared/common/messages';
import { Roles } from '@prisma/client';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class SupervisorService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    userPermissionService: UserPermissionService,
    private userFactory: UserFactory,
  ) {
    super(
      userRepository,
      userValidator,
      userQueryService,
      userPermissionService,
      Roles.OPERADOR,
    );
  }

  //  Funcionalidades específicas (schema DEPARTAMENTO ESTADUAL DE RODOVIAS: mapeado para OPERADOR)
  async criarNovoSupervisor(dto: CreateSupervisorDto) {
    this.userPermissionService.validarCriacaoDeUserComRole(Roles.OPERADOR);

    // Valida se email é único
    await this.validarSeEmailEhUnico(dto.email);

    // Criação do usuário
    const userData = this.userFactory.criarSupervisor(dto);
    const user = await this.userRepository.criar(userData);

    // Permission
    if (dto.permissions) {
      await this.userRepository.criarPermissaoDeVigilante({
        userId: user.id,
        permissionType: dto.permissions,
      });
    }

    return user;
  }
}
