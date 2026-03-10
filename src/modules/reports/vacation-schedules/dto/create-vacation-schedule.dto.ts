import { IsString, IsNumber, IsDate, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { VacationScheduleStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';

export class CreateVacationScheduleDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(2020, { message: 'Ano deve ser maior ou igual a 2020' })
  @Max(2100, { message: 'Ano deve ser menor ou igual a 2100' })
  year: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(1, { message: 'Mês deve ser entre 1 e 12' })
  @Max(12, { message: 'Mês deve ser entre 1 e 12' })
  month: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  employeeName: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  employeeId: string;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  startDate: Date;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  endDate: Date;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(1, { message: 'Total de dias deve ser maior que 0' })
  @Max(60, { message: 'Total de dias deve ser menor ou igual a 60' })
  totalDays: number;

  @IsEnum(VacationScheduleStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: VacationScheduleStatus;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  notes?: string;
}







