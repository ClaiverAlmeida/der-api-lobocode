import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodBasketDto } from './create-food-basket.dto';

/**
 * DTO para atualização de entrega de cesta básica
 * Todos os campos são opcionais
 */
export class UpdateFoodBasketDto extends PartialType(CreateFoodBasketDto) {}
