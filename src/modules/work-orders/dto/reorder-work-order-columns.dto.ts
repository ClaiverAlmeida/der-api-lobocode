import { ArrayNotEmpty, IsArray } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { IsCUID } from '../../../shared/validators';

export class ReorderWorkOrderColumnsDto {
  @IsArray({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ each: true, message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  orderedIds: string[];
}
