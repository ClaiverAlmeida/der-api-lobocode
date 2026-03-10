import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { IsCUID, IsCPF } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { ClientStatus } from '@prisma/client';

export class CreateClientsDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  usaName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCPF({ message: VALIDATION_MESSAGES.FORMAT.CPF_INVALID })
  usaCpf?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  usaPhone: string;

  @IsObject({ message: 'Endereço nos EUA deve ser um objeto' })
  usaAddress: Record<string, unknown>;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
  brazilName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCPF({ message: VALIDATION_MESSAGES.FORMAT.CPF_INVALID })
  brazilCpf?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  brazilPhone: string;

  @IsObject({ message: 'Destino no Brasil deve ser um objeto' })
  brazilAddress: Record<string, unknown>;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userId: string;

  @IsOptional()
  @IsEnum(ClientStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: ClientStatus;
}
