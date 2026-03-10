import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleChecklistDto } from './create-vehicle-checklist.dto';

export class UpdateVehicleChecklistDto extends PartialType(
  CreateVehicleChecklistDto,
) {}
