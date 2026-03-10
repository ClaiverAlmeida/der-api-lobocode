import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';
import { StockMovementType, ProductType } from '@prisma/client';
import { IsCUID } from 'src/shared/validators';

export class StockMovementDto {
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsEnum(StockMovementType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  type: StockMovementType;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsEnum(ProductType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  productType: ProductType;

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  @Min(1, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  quantity: number;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  userId: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsOptional()
  observations?: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  productId: string;
}