import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { QueueStatus } from '@prisma/client';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateQueuesDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MaxLength(120, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
  title: string;

  @IsOptional()
  @IsEnum(QueueStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: QueueStatus;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @ArrayUnique({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({ each: true, message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userIds?: string[];
}
