import {
  IsString,
  MinLength,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateMotorcycleChecklistDto {
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: Date;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  initialKm: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  finalKm?: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  driverName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  generalObservation?: string;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  isCompleted?: boolean;

  @IsOptional()
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  completedAt?: Date;

  @IsEnum(ReportStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: ReportStatus;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  motorcycleId: string;

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

  // Água do Radiador
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorObservacao?: string;

  // Água Reservatório Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  radiadorFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  radiadorDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  radiadorObservacao?: string;

  // Óleo Motor
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioDianteiroFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioDianteiroDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioDianteiroObservacao?: string;

  // Óleo Freio
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioTraseiroFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioTraseiroDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  freioTraseiroObservacao?: string;

  // Lanterna Dianteira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroObservacao?: string;

  // Lanterna Dianteira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoObservacao?: string;

  // Farol Baixo Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoObservacao?: string;

  // Farol Baixo Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDireitaDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDireitaObservacao?: string;

  // Farol Alto Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaEsquerdaDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaEsquerdaObservacao?: string;

  // Farol Alto Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraObservacao?: string;

  // Seta Dianteira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioObservacao?: string;

  // Seta Dianteira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReObservacao?: string;

  // Seta Traseira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorEsquerdoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorEsquerdoDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorEsquerdoObservacao?: string;

  // Seta Traseira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorDireitoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorDireitoDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  retrovisorDireitoObservacao?: string;

  // Pisca Alerta
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaObservacao?: string;

  // Buzina
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  correnteFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  correnteDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  correnteObservacao?: string;

  // Limpador de Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  manetesFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  manetesDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  manetesObservacao?: string;

  // Esguicho d'Água Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  guidonFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  guidonDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  guidonObservacao?: string;

  // Lanterna Traseira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  bauFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  bauDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  bauObservacao?: string;

  // Lanterna Traseira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  suporteBauFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  suporteBauDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  suporteBauObservacao?: string;

  // Luz de Freio
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  capaceteFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  capaceteDanificado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  capaceteObservacao?: string;
}
