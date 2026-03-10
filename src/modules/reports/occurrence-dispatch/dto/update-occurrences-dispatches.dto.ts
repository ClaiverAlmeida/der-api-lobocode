import { PartialType } from '@nestjs/mapped-types';
import { CreateOccurrenceDispatchDto } from './create-occurrences-dispatches.dto';

export class UpdateOccurrenceDispatchDto extends PartialType(CreateOccurrenceDispatchDto) {}    