import {
    IsString,
    IsOptional,
    IsEnum,
    IsObject,
    MinLength,
  } from 'class-validator';
  import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateClientsHistoryDto {
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    clientId: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    entityId: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    entityType: string;
    
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    actionType: string;
    
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    message: string;
}
