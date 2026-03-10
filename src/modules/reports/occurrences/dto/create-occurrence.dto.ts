import { IsString, MinLength, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../../shared/common/messages';
import { IsCUID } from 'src/shared/validators';

export class CreateOccurrenceDto {
  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  date: Date;

  @IsDate({ message: VALIDATION_MESSAGES.FORMAT.DATE_INVALID })
  time: Date;

  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @MinLength(4, { message: VALIDATION_MESSAGES.LENGTH.MIN_LENGTH })
  applicant: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  userName: string;
    
  @IsString({ message: VALIDATION_MESSAGES.REQUIRED.FIELD })
  @MinLength(6, { message: VALIDATION_MESSAGES.LENGTH.MIN_LENGTH })
  rg: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  postName: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  postAddress: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  peopleInvolved: string;

  @IsString({ message: VALIDATION_MESSAGES.FORMAT.FIELD_INVALID })
  description: string;

  @IsEnum(ReportStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status: ReportStatus;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  postId: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  shiftId: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  companyId?: string;

  @IsCUID({ message: VALIDATION_MESSAGES.FORMAT.UUID_INVALID })
  occurrenceDispatchId?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_MESSAGES.FORMAT.NUMBER_INVALID })
  talaoNumber?: number;
}
