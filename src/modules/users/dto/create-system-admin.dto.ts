import { Roles } from '@prisma/client';
import { IsExpectedRole } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { BaseUserDto } from './base-user.dto';

export class CreateSystemAdminDto extends BaseUserDto {
  @IsExpectedRole(Roles.SYSTEM_ADMIN, {
    message: VALIDATION_MESSAGES.REQUIRED.ROLE,
  })
  role: Roles; // Deve ser Roles.SYSTEM_ADMIN
}
