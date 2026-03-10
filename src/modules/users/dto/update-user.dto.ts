import { PartialType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { PermissionType, Roles } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';
import { IsExpectedRole } from 'src/shared/validators';

export class UpdateUserDto extends PartialType(BaseUserDto) {
  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.ARRAY_INVALID })
  @IsEnum(PermissionType, {
    each: true,
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  permissions?: PermissionType[];

  @IsOptional()
  @IsEnum(Roles, { message: VALIDATION_MESSAGES.REQUIRED.ROLE })
  role?: Roles; // Deve ser Roles.HR
}
