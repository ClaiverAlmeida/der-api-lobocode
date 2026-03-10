import { PartialType } from '@nestjs/mapped-types';
import { CreateContainersDto } from './create-containers.dto';

export class UpdateContainersDto extends PartialType(CreateContainersDto) {}