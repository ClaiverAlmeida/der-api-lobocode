import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { ContainerType, ContainerStatus } from '@prisma/client';

export class CreateContainersDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  number: string;

  @IsEnum(ContainerType, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  type: ContainerType

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  origin: string

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  destination: string

  // @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  // @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  // shipmentDate: string

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  boardingDate: string

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  estimatedArrival: string

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  volume: number

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  weightLimit: number

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  trackingLink: string

  @IsEnum(ContainerStatus, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  status: ContainerStatus
}
