import { PartialType } from '@nestjs/mapped-types';
import { CreateHighwayDto } from './create-highway.dto';

export class UpdateHighwayDto extends PartialType(CreateHighwayDto) {}

