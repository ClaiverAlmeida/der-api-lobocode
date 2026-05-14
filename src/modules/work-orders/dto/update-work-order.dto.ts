import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, Matches, ValidateIf } from 'class-validator';
import { WorkOrderPriority } from '@prisma/client';
import { CreateWorkOrderDto } from './create-work-order.dto';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class UpdateWorkOrderDto extends PartialType(
  OmitType(CreateWorkOrderDto, ['dueDate', 'priority'] as const),
) {
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, v) => v != null)
  @IsEnum(WorkOrderPriority, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  priority?: WorkOrderPriority | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, v) => v != null)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Prazo inválido. Use o formato AAAA-MM-DD (somente data).',
  })
  dueDate?: string | null;
}
