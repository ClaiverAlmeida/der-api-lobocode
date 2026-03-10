import { IsOptional, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from 'src/shared/common/messages';

export class CompleteWorkOrderDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  resolutionNotes?: string;
}
