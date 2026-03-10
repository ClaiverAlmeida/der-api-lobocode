import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DocumentStatus } from '@prisma/client';
import { VALIDATION_MESSAGES } from '../../../shared/common/messages';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsOptional()
  @IsEnum(DocumentStatus, {
    message: VALIDATION_MESSAGES.FORMAT.ENUM_INVALID,
  })
  status?: DocumentStatus;
}
