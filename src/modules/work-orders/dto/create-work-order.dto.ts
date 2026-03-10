import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import {
  WorkOrderPriority,
  WorkOrderStatus,
  WorkOrderType,
  WorkOrderSlaStatus,
} from '@prisma/client';
import { IsCUID } from '../../../shared/validators';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class CreateWorkOrderDto {
  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  assetId: string;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.NAME })
  title: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  description?: string;

  @IsEnum(WorkOrderPriority, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  priority: WorkOrderPriority;

  @IsOptional()
  @IsEnum(WorkOrderStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: WorkOrderStatus;

  @IsEnum(WorkOrderType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  type: WorkOrderType;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  assignedToUserId?: string;

  @IsOptional()
  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  dueDate?: string;

  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  slaDeadlineHours?: number;

  @IsOptional()
  @IsEnum(WorkOrderSlaStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  slaStatus?: WorkOrderSlaStatus;
}

