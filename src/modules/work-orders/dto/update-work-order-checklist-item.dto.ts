import { IsBoolean } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';

export class UpdateWorkOrderChecklistItemDto {
  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  isDone: boolean;
}
