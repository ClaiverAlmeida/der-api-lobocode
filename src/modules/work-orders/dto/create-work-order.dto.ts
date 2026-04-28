import {
  ArrayUnique,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';
import {
  AssetType,
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

  @IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  locationId: string;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @ArrayUnique({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  @IsCUID({
    each: true,
    message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID,
  })
  assignedToUserIds?: string[];

  @IsOptional()
  @IsDateString({}, { message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  dueDate?: string;

  @IsOptional()
  @IsEnum(AssetType, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  equipmentType?: AssetType;

  @IsOptional()
  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  columnId?: string;

  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  slaDeadlineHours?: number;

  @IsOptional()
  @IsEnum(WorkOrderSlaStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  slaStatus?: WorkOrderSlaStatus;
}

