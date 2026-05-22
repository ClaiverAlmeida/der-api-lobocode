import { PartialType } from '@nestjs/mapped-types';
import { CreateQueuesDto } from './create-queues.dto';

export class UpdateQueuesDto extends PartialType(CreateQueuesDto) {}
