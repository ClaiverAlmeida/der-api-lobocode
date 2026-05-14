import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { WorkOrderPausePresetReason } from '../work-order-pause-history/work-order-pause-preset.constants';

export class CreateWorkOrderPauseHistoryDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsEnum(WorkOrderPausePresetReason, {
    message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID,
  })
  presetReason: WorkOrderPausePresetReason;

  @ValidateIf(
    (body: CreateWorkOrderPauseHistoryDto) =>
      body.presetReason === WorkOrderPausePresetReason.OTHER,
  )
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(500, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  customReason?: string;
}
