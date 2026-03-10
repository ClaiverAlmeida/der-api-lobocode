import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class AssignWorkOrderDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  assignedToUserId: string;
}
