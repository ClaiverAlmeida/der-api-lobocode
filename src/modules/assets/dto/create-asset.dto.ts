import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AssetCriticality,
  AssetConnectionType,
  AssetStatus,
  AssetType,
} from '@prisma/client';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateAssetDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  name: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  code?: string;

  @IsEnum(AssetType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  type: AssetType;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  locationId: string;

  @Type(() => Number)
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  km: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  direction: string;

  @IsOptional()
  @IsEnum(AssetStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: AssetStatus;

  @IsOptional()
  @IsEnum(AssetCriticality, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  criticality?: AssetCriticality;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  longitude?: number;

  @IsOptional()
  @IsEnum(AssetConnectionType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  connectionType?: AssetConnectionType;

  @IsOptional()
  @IsUrl({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  connectionUrl?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  connectionToken?: string;
}

