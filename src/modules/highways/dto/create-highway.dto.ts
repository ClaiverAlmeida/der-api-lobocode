import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { HighwayStatus } from '@prisma/client';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateHighwayDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MaxLength(50, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
  code: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MaxLength(120, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(2, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
  uf: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID },
  )
  startKm?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID },
  )
  endKm?: number;

  @IsOptional()
  @IsEnum(HighwayStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: HighwayStatus;
}

