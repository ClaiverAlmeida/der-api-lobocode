import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';

export class CreateWorkOrderCheckListDto {
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  label: string;
}
