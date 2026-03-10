import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { UpdateStockDto } from './update-stock.dto';
import { StockMovementDto } from './stock-movement.dto';

export class PatchStockBodyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStockDto)
  stock?: UpdateStockDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => StockMovementDto)
  movement?: StockMovementDto;
}
