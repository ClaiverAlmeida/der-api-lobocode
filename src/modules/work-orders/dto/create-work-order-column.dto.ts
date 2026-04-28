import { IsHexColor, IsOptional, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { IsCUID } from '../../../shared/validators';

export class CreateWorkOrderColumnDto {
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsHexColor({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  color: string;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  regionalId?: string;
}
