import { IsString, MinLength, IsDate, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ReportStatus, FuelLevel, WorkShift } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateMotorizedServiceDto {
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: Date;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  kmInitial: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  kmFinal?: number;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  kmTraveled?: number;

  @IsEnum(FuelLevel, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  fuel: FuelLevel;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  timeInitial: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  timeFinal?: string;

  @IsEnum(WorkShift, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  workShift: WorkShift;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  streetPatrol?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  occurrence?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  vehicleInspection?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  vehicleId?: string;

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

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  userName: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  witnessName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  supervisorName?: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  supervisorId?: string;
}
