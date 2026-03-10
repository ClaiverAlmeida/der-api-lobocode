import { Injectable } from '@nestjs/common';
import { CreateSystemAdminDto } from './dto/create-system-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateGuardDto } from './dto/create-guard.dto';
import { CreateHRDto } from './dto/create-hr.dto';
import { CreatePostResidentDto } from './dto/create-post-resident.dto';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { CreatePostSupervisorDto } from './dto/create-post-supervisor.dto';
import { BaseUserService } from './services/base-user.service';
import { UserRepository } from './repositories/user.repository';
import { UserValidator } from './validators/user.validator';
import { UserQueryService } from './services/user-query.service';
import {
  SystemAdminService,
  AdminService,
  SupervisorService,
  GuardService,
  HRService,
  PostSupervisorService,
  PostResidentService,
  UserPermissionService,
} from './services';
import { CreateOthersDto } from './dto/create-others.dto';
import { Prisma, Roles, UserStatus } from '@prisma/client';
import { UserFactory } from './factories/user.factory';

@Injectable()
export class UsersService extends BaseUserService {
  constructor(
    userRepository: UserRepository,
    userValidator: UserValidator,
    userQueryService: UserQueryService,
    userPermissionService: UserPermissionService,
    private systemAdminService: SystemAdminService,
    private adminService: AdminService,
    private supervisorService: SupervisorService,
    private guardService: GuardService,
    private hrService: HRService,
    private postSupervisorService: PostSupervisorService,
    private postResidentService: PostResidentService,
    private userFactory: UserFactory,
  ) {
    super(
      userRepository,
      userValidator,
      userQueryService,
      userPermissionService,
    );
  }

  //  Métodos de orquestração - delegam para serviços específicos
  async criarNovoSystemAdmin(dto: CreateSystemAdminDto) {
    return this.systemAdminService.criarNovoSystemAdmin(dto);
  }

  async criarNovoAdmin(dto: CreateAdminDto) {
    return this.adminService.criarNovoAdmin(dto);
  }

  /**
   * Cria usuário
   */
  //  Funcionalidades específicas de RH
  async criarNovoOthers(dto: CreateOthersDto) {
    // ✅ Validação de role hierárquico RESTAURADA
    this.userPermissionService.validarCriacaoDeUserComRole(dto.role);

    // Validações comuns
    await this.validarSeEmailEhUnico(dto.email);

    // Criação do usuário
    const userData = this.userFactory.criarOthers(dto);
    const user = await this.userRepository.criar(
      userData as Prisma.UserCreateInput,
    );

    return user;
  }

  async criarNovoHR(dto: CreateHRDto) {
    return this.hrService.criarNovoHR(dto);
  }

  async criarNovoSupervisor(dto: CreateSupervisorDto) {
    return this.supervisorService.criarNovoSupervisor(dto);
  }

  async criarNovoGuard(dto: CreateGuardDto) {
    return this.guardService.criarNovoGuard(dto);
  }

  async criarNovoPostSupervisor(dto: CreatePostSupervisorDto) {
    return this.postSupervisorService.criarNovoPostSupervisor(dto);
  }

  async criarNovoPostResident(dto: CreatePostResidentDto) {
    return this.postResidentService.criarNovoPostResident(dto);
  }

  /**
   * Cria POST_SUPERVISOR via registro público (sem autenticação)
   */
  async criarPostSupervisorPublico(dto: CreatePostSupervisorDto) {
    return this.postSupervisorService.criarPostSupervisorPublico(dto);
  }

  /**
   * Cria POST_RESIDENT via registro público (sem autenticação)
   */
  async criarPostResidentPublico(dto: CreatePostResidentDto) {
    return this.postResidentService.criarPostResidentPublico(dto);
  }

  /**
   * Busca clientes (POST_SUPERVISOR e POST_RESIDENT) de um posto específico
   */
  async buscarClientesPorPosto(
    postId: string,
    page = 1,
    limit = 20,
    orderBy = 'name',
    orderDirection: 'asc' | 'desc' = 'asc',
  ) {
    const baseWhereClause =
      this.userQueryService.construirWhereClauseParaRead();
    const skip = (page - 1) * limit;

    // Configuração de ordenação
    const orderByConfig = {
      [orderBy]: orderDirection,
    };

    // Filtrar por roles (schema DEPARTAMENTO ESTADUAL DE RODOVIAS - sem Post/userPosts)
    const whereClause: Prisma.UserWhereInput = {
      ...baseWhereClause,
      role: {
        in: [Roles.COMERCIAL, Roles.LOGISTICS],
      },
    };

    const [users, total] = await Promise.all([
      this.userRepository.buscarMuitos(whereClause, {
        skip,
        take: limit,
        orderBy: orderByConfig,
      } as any),
      this.userRepository.contar(whereClause),
    ]);

    // Calcular informações de paginação manualmente
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Transformar dados dos usuários
    const transformedData = users.map((user) => ({
      ...user,
      permissions:
        user.permissions?.map((permission: any) => permission.permissionType) ||
        [],
    }));

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Busca vigilantes ativos em turno no posto específico
   */
  async buscarVigilantesAtivosEmTurnoNoPosto(_postId: string) {
    // Schema DEPARTAMENTO ESTADUAL DE RODOVIAS: sem Shift/Post - retorna usuários ativos com role DRIVER/LOGISTICS
    const whereClause = this.userQueryService.construirWhereClauseParaRead({
      role: { in: [Roles.DRIVER, Roles.LOGISTICS] },
      status: UserStatus.ACTIVE,
    });

    const users = await this.userRepository.buscarMuitos(whereClause);

    // Transforma os dados dos usuários para o formato esperado pelo frontend
    return users.map((user) => ({
      ...user,
      permissions:
        user.permissions?.map((permission: any) => permission.permissionType) ||
        [],
    }));
  }

  // Busca todos os motoristas ativos
  async buscarTodosMotoristas() {
    const whereClause = { role: Roles.DRIVER, status: UserStatus.ACTIVE };
    return this.userRepository.buscarMuitos(whereClause);
  }

  async buscarTodosResponsaveisPorOrdensDeServico() {
    const whereClause = {
      role: { in: [Roles.DRIVER, Roles.LOGISTICS] },
      status: UserStatus.ACTIVE,
    };

    return this.userRepository.buscarMuitos(whereClause);
  }
}
