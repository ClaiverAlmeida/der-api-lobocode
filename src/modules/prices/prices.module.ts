import { Module } from '@nestjs/common';
import { DeliveryPricesController } from './delivery/delivery.controller';
import { DeliveryPricesService } from './delivery/delivery.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [],
  controllers: [DeliveryPricesController, ProductsController],
  providers: [DeliveryPricesService, ProductsService],
  exports: [DeliveryPricesService, ProductsService],
})
export class PricesModule {}
