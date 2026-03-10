import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplinaryWarningDto } from './create-disciplinary-warning.dto';

/**
 * DTO para atualização de carta de advertência disciplinar
 * Todos os campos são opcionais
 */
export class UpdateDisciplinaryWarningDto extends PartialType(CreateDisciplinaryWarningDto) {}
