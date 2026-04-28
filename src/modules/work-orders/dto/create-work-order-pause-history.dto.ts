import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateWorkOrderPauseHistoryDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @MaxLength(500, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  reason: string;
}
