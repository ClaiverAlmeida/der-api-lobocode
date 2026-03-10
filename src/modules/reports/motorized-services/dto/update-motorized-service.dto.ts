import { PartialType } from '@nestjs/mapped-types';
import { CreateMotorizedServiceDto } from './create-motorized-service.dto';

export class UpdateMotorizedServiceDto extends PartialType(CreateMotorizedServiceDto) {}    