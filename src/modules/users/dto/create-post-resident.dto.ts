import { IsString, IsOptional } from 'class-validator';
import { Roles } from '@prisma/client';
import { IsCUID, IsExpectedRole } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { BaseUserDto } from './base-user.dto';

export class CreatePostResidentDto extends BaseUserDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  postId?: string;

  @IsExpectedRole(Roles.C2C, {
    message: VALIDATION_MESSAGES.REQUIRED.ROLE,
  })
  role: Roles; // Schema DEPARTAMENTO ESTADUAL DE RODOVIAS: mapeado para OPERADOR
}
