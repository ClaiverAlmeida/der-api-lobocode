import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Roles, UserStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateSystemAdminDto } from '../dto/create-system-admin.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreateGuardDto } from '../dto/create-guard.dto';
import { CreateHRDto } from '../dto/create-hr.dto';
import { CreatePostResidentDto } from '../dto/create-post-resident.dto';
import { CreatePostSupervisorDto } from '../dto/create-post-supervisor.dto';
import { CreateSupervisorDto } from '../dto/create-supervisor.dto';
import { CreateOthersDto } from '../dto/create-others.dto';

@Injectable()
export class UserFactory {
  private criptografarPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  private criarUsuarioBase(dto: any, role: Roles): Prisma.UserCreateInput {
    return {
      name: dto.name,
      login: dto.login.trim().toLowerCase(),
      email: dto.email.trim().toLowerCase(),
      registration: dto?.registration,
      cpf: dto?.cpf,
      rg: dto?.rg,
      phone: dto?.phone,
      address: dto?.address,
      profilePicture: dto?.profilePicture,
      status: dto?.status,
      password: this.criptografarPassword(dto.password),
      role: role,
      company: dto.companyId ? {
        connect: { id: dto.companyId },
      } : undefined,
    };
  }

  criarSystemAdmin(dto: CreateSystemAdminDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.SYSTEM_ADMIN);
  }

  criarOthers(dto: CreateOthersDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, dto.role);
  }

  criarAdmin(dto: CreateAdminDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.ADMIN);
  }

  criarSupervisor(dto: CreateSupervisorDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.OPERADOR);
  }

  criarGuard(dto: CreateGuardDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.INSPETOR_VIA);
  }

  criarHR(dto: CreateHRDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.ADMIN);
  }

  criarPostSupervisor(dto: CreatePostSupervisorDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.OPERADOR);
  }

  criarPostResident(dto: CreatePostResidentDto): Prisma.UserCreateInput {
    return this.criarUsuarioBase(dto, Roles.OPERADOR);
  }
}
