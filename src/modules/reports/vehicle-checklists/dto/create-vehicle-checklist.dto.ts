import { IsString, MinLength, IsDate, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateVehicleChecklistDto {
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
  vehicleId: string;

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
  aguaRadiadorFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaRadiadorAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaRadiadorArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaRadiadorObservacao?: string;

  // Água Reservatório Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaReservatorioFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaReservatorioAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaReservatorioArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  aguaReservatorioObservacao?: string;

  // Óleo Motor
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoMotorObservacao?: string;

  // Óleo Freio
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoFreioFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoFreioAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoFreioArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  oleoFreioObservacao?: string;

  // Lanterna Dianteira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraDireitaObservacao?: string;

  // Lanterna Dianteira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaDianteiraEsquerdaObservacao?: string;

  // Farol Baixo Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoDireitaObservacao?: string;

  // Farol Baixo Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolBaixoEsquerdaObservacao?: string;

  // Farol Alto Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoDireitaObservacao?: string;

  // Farol Alto Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  farolAltoEsquerdaObservacao?: string;

  // Seta Dianteira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraDireitaObservacao?: string;

  // Seta Dianteira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaDianteiraEsquerdaObservacao?: string;

  // Seta Traseira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraDireitaObservacao?: string;

  // Seta Traseira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  setaTraseiraEsquerdaObservacao?: string;

  // Pisca Alerta
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  piscaAlertaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  piscaAlertaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  piscaAlertaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  piscaAlertaObservacao?: string;

  // Buzina
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  buzinaObservacao?: string;

  // Limpador de Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  limpadorParabrisaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  limpadorParabrisaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  limpadorParabrisaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  limpadorParabrisaObservacao?: string;

  // Esguicho d'Água Parabrisa
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  esguichoAguaParabrisaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  esguichoAguaParabrisaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  esguichoAguaParabrisaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  esguichoAguaParabrisaObservacao?: string;

  // Lanterna Traseira Direita
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraDireitaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraDireitaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraDireitaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraDireitaObservacao?: string;

  // Lanterna Traseira Esquerda
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraEsquerdaFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraEsquerdaAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraEsquerdaArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  lanternaTraseiraEsquerdaObservacao?: string;

  // Luz de Freio
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzFreioObservacao?: string;

  // Luz de Ré
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  luzReObservacao?: string;

  // Pneu Dianteiro Direito
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroDireitoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroDireitoAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroDireitoArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroDireitoObservacao?: string;

  // Pneu Dianteiro Esquerdo
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroEsquerdoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroEsquerdoAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroEsquerdoArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuDianteiroEsquerdoObservacao?: string;

  // Pneu Traseiro Direito
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroDireitoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroDireitoAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroDireitoArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroDireitoObservacao?: string;

  // Pneu Traseiro Esquerdo
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroEsquerdoFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroEsquerdoAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroEsquerdoArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuTraseiroEsquerdoObservacao?: string;

  // Pneu Estepe
  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuEstepeFuncionando?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuEstepeAmassado?: boolean;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuEstepeArranhado?: boolean;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  pneuEstepeObservacao?: string;
}
