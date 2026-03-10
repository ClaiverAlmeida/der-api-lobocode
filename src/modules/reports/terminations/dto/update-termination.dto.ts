import { PartialType } from '@nestjs/mapped-types';
import { CreateTerminationDto } from './create-termination.dto';

/**
 * DTO para atualização de documento de desligamento
 * Todos os campos são opcionais
 */
export class UpdateTerminationDto extends PartialType(CreateTerminationDto) {}




