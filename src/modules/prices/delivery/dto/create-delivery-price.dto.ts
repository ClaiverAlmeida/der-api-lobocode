import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';

export class CreateDeliveryPriceDto {
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    originCity: string;

    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @MaxLength(2, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    originState: string;
    
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @MinLength(2, { message: VALIDATION_MESSAGES.LENGTH.NAME_MIN })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    destinationCity: string;
    
    @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
    @MaxLength(2, { message: VALIDATION_MESSAGES.LENGTH.MAX_LENGTH })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    destinationState: string;
    
    @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    pricePerKg: number;

    @IsNumber({}, { message: VALIDATION_MESSAGES.NUMBER.MIN })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    minimumPrice: number;

    @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    @Min(1, { message: VALIDATION_MESSAGES.NUMBER.MIN })
    deliveryDeadline: number;
    
    @IsBoolean()
    @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
    active: boolean;
}
