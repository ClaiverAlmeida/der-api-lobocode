import { PartialType } from '@nestjs/mapped-types';
import { CreateClientsDto } from './create-clients.dto';

export class UpdateClientsDto extends PartialType(CreateClientsDto) {}
