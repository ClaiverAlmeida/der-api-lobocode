import { WorkOrderType } from '@prisma/client';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreatePlanningDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  title: string;

  @IsEnum(WorkOrderType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  serviceType: WorkOrderType;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  startDate: string;

  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  endDate: string;

  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @ArrayUnique({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({ each: true, message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  responsibleIds: string[];

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  workOrderId?: string | null;
}
