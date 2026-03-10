import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MinLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { ProductType } from '@prisma/client';

export class CreateProductsDto {
  @IsEnum(ProductType, { message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID })
  type: ProductType;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  name: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  dimensions: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  maxWeight: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  costPrice: number;

  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  salePrice: number;

  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.BOOLEAN_INVALID })
  active: boolean;

  @IsBoolean({ message: VALIDATION_MESSAGES.FORMAT.BOOLEAN_INVALID })
  variablePrice: boolean;
}
