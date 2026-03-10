import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { FoodBasketStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';

/**
 * DTO para criação de entrega de cesta básica
 */
export class CreateFoodBasketDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(1, { message: 'ID do funcionário é obrigatório' })
  employeeId: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(3, { message: 'Nome do funcionário deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome do funcionário deve ter no máximo 255 caracteres' })
  employeeName: string;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  withdrawalDate: Date;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(2, { message: 'Posto de serviço deve ter no mínimo 2 caracteres' })
  @MaxLength(255, { message: 'Posto de serviço deve ter no máximo 255 caracteres' })
  servicePost: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(255, { message: 'ID do posto de serviço deve ter no máximo 255 caracteres' })
  servicePostId?: string;

  @IsInt({ message: 'Mês de referência deve ser um número inteiro' })
  @Min(1, { message: 'Mês de referência deve ser entre 1 e 12' })
  @Max(12, { message: 'Mês de referência deve ser entre 1 e 12' })
  referenceMonth: number;

  @IsInt({ message: 'Ano de referência deve ser um número inteiro' })
  @Min(2020, { message: 'Ano de referência deve ser maior ou igual a 2020' })
  @Max(2100, { message: 'Ano de referência deve ser menor ou igual a 2100' })
  referenceYear: number;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  signature?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(100, { message: 'Provedor de assinatura deve ter no máximo 100 caracteres' })
  signatureProvider?: string;

  @IsEnum(FoodBasketStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: FoodBasketStatus;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(2000, { message: 'Observações deve ter no máximo 2000 caracteres' })
  notes?: string;
}
