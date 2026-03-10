import { PartialType } from '@nestjs/mapped-types';
import { CreateVacationScheduleDto } from './create-vacation-schedule.dto';
import { IsString, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from '../../../../shared/validators';

export class UpdateVacationScheduleDto extends PartialType(CreateVacationScheduleDto) {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  id?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  plannedStartDate?: string;

  @IsOptional()
  thirteenthSalaryBonus?: boolean;
}








