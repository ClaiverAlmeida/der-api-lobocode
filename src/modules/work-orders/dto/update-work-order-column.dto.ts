import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkOrderColumnDto } from './create-work-order-column.dto';

export class UpdateWorkOrderColumnDto extends PartialType(
  CreateWorkOrderColumnDto,
) {}
