import { PartialType } from '@nestjs/mapped-types';
import { IncrementStockDto } from "./update-stock.dto";

export class DecrementStockDto extends PartialType(IncrementStockDto) {}