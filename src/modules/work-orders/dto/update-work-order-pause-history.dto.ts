import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkOrderPauseHistoryDto } from './create-work-order-pause-history.dto';

export class UpdateWorkOrderPauseHistoryDto extends PartialType(
  CreateWorkOrderPauseHistoryDto,
) {}
