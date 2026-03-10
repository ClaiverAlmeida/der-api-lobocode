import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { DisciplinaryWarningStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';

/**
 * DTO para criação de carta de advertência disciplinar
 */
export class CreateDisciplinaryWarningDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(1, { message: 'Número da advertência é obrigatório' })
  warningNumber: string;

  @IsBoolean({ message: 'Reincidente deve ser um valor booleano' })
  isRecidivist: boolean;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX',
  })
  companyCnpj: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(5, { message: 'Endereço deve ter no mínimo 5 caracteres' })
  companyAddress: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(1, { message: 'ID do funcionário é obrigatório' })
  employeeId: string; // Será transformado em employee: { connect: { id } } pelo repository

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(3, { message: 'Nome do funcionário deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome do funcionário deve ter no máximo 255 caracteres' })
  employeeName: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX',
  })
  employeeCpf: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(2, { message: 'Cargo deve ter no mínimo 2 caracteres' })
  @MaxLength(255, { message: 'Cargo deve ter no máximo 255 caracteres' })
  employeePosition: string;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  warningDate: Date;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(10, { message: 'Descrição da conduta deve ter no mínimo 10 caracteres' })
  @MaxLength(5000, { message: 'Descrição da conduta deve ter no máximo 5000 caracteres' })
  conductDescription: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(3, { message: 'Nome do responsável deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome do responsável deve ter no máximo 255 caracteres' })
  responsibleName: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MinLength(2, { message: 'Cargo do responsável deve ter no mínimo 2 caracteres' })
  @MaxLength(255, { message: 'Cargo do responsável deve ter no máximo 255 caracteres' })
  responsiblePosition: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  responsibleSignature?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  employeeSignature?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  witnessSignature?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(255, { message: 'Nome da testemunha deve ter no máximo 255 caracteres' })
  @ValidateIf((o) => o.witnessSignature !== undefined && o.witnessSignature !== null)
  @MinLength(3, { message: 'Nome da testemunha é obrigatório se houver assinatura' })
  witnessName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(100, { message: 'Provedor de assinatura deve ter no máximo 100 caracteres' })
  signatureProvider?: string;

  @IsEnum(DisciplinaryWarningStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: DisciplinaryWarningStatus;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(2000, { message: 'Observações deve ter no máximo 2000 caracteres' })
  notes?: string;
}
