import { PartialType } from '@nestjs/mapped-types';
import { CreateDoormanChecklistDto } from './create-doorman-checklist.dto';

export class UpdateDoormanChecklistDto extends PartialType(
  CreateDoormanChecklistDto,
) {}
