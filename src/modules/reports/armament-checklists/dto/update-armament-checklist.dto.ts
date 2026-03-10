import { PartialType } from '@nestjs/mapped-types';
import { CreateArmamentChecklistDto } from './create-armament-checklist.dto';

export class UpdateArmamentChecklistDto extends PartialType(
  CreateArmamentChecklistDto,
) {}
