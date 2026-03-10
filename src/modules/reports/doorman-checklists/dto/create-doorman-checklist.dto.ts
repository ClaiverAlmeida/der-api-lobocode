import { IsString, MinLength, IsDate, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateDoormanChecklistDto {
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
  // ITENS DO CHECKLIST - CAMPOS FIXOS
  // ========================================

  // Portão
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  portaoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  portaoAmassado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  portaoObservacao?: string;

  // Computador
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  computadorFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  computadorAmassado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  computadorObservacao?: string;

  // Sistema de Monitoramento
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  sistemaDeMonitoramentoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  sistemaDeMonitoramentoAmassado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  sistemaDeMonitoramentoObservacao?: string;
}
