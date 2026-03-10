import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryPriceDto } from './create-delivery-price.dto';

export class UpdateDeliveryPriceDto extends PartialType(CreateDeliveryPriceDto) {}