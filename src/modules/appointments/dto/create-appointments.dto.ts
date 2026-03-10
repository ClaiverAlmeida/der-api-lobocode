import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentsDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  clientId: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userId: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  collectionDate: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  collectionTime?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  address: string;

  @IsEnum(AppointmentStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  status: AppointmentStatus;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  observations?: string;

  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(1, { message: VALIDATION_MESSAGES.LENGTH.MIN_LENGTH })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  qtyBoxes: number;
}
