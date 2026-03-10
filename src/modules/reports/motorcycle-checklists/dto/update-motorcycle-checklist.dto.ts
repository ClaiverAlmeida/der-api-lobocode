import { PartialType } from '@nestjs/mapped-types';
import { CreateMotorcycleChecklistDto } from './create-motorcycle-checklist.dto';

export class UpdateMotorcycleChecklistDto extends PartialType(
  CreateMotorcycleChecklistDto,
) {}
