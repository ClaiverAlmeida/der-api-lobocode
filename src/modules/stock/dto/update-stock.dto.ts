import { IsNumber, IsOptional, Min } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class UpdateStockDto {
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  smallBoxes?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  mediumBoxes?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  largeBoxes?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  adhesiveTape?: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @IsOptional()
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  personalizedItems?: number;
}

export { UpdateStockDto as IncrementStockDto };
