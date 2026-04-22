import { IsCUID } from 'src/shared/validators';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
} from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';

export class AssignWorkOrderDto {
  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @ArrayUnique({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({
    each: true,
    message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID,
  })
  assignedToUserIds?: string[];
}
