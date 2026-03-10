import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentsDto } from './create-appointments.dto';

export class UpdateAppointmentsDto extends PartialType(CreateAppointmentsDto) {}
