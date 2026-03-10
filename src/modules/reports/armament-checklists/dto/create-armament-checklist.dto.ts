import { IsString, MinLength, IsDate, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateArmamentChecklistDto {
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: Date;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @MinLength(4, { message: VALIDATION_MESSAGES.LENGTH.MIN_LENGTH })
  userName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  generalObservation?: string;

  @IsEnum(ReportStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: ReportStatus;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  postId: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  shiftId: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userId?: string;

  // ========================================
  // CAMPOS ESPECÍFICOS DO ARMAMENTO
  // ========================================

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  numberArmament?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  numberBallisticPlate?: string;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  cmvInDay?: boolean;

  // ========================================
  // ITENS DO CHECKLIST - CAMPOS FIXOS
  // ========================================

  // Rádio HT
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  RadioHTFuncionando?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  RadioHTObservacao?: string;

  // Armamento
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  armamentoFuncionando?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  armamentoObservacao?: string;
}
