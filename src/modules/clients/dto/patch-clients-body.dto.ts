import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { UpdateClientsDto } from './update-clients.dto';

export class PatchClientsBodyDto {
  @ValidateNested()
  @Type(() => UpdateClientsDto)
  data: UpdateClientsDto;

  @IsOptional()
  @IsObject()
  changes?: Record<string, { before?: unknown; after?: unknown }>;
}
