import { Module } from '@nestjs/common';
import { OccurrencesController } from './occurrences/occurrences.controller';
import { OccurrencesService } from './occurrences/occurrences.service';
import { VehicleChecklistsController } from './vehicle-checklists/vehicle-checklists.controller';
import { VehicleChecklistsService } from './vehicle-checklists/vehicle-checklists.service';
import { SuppliesController } from './supplies/supplies.controller';
import { SuppliesService } from './supplies/supplies.service';
import { MotorizedServicesController } from './motorized-services/motorized-service.controller';
import { MotorizedServicesService } from './motorized-services/motorized-service.service';
import { OccurrencesDispatchesController } from './occurrence-dispatch/occurrences-dispatches.controller';
import { OccurrencesDispatchesService } from './occurrence-dispatch/occurrences-dispatches.service';
import { DoormanChecklistsController } from './doorman-checklists/doorman-checklists.controller';
import { DoormanChecklistsService } from './doorman-checklists/doorman-checklists.service';
import { ArmamentChecklistsController } from './armament-checklists/armament-checklists.controller';
import { ArmamentChecklistsService } from './armament-checklists/armament-checklists.service';
import { MotorcycleChecklistsController } from './motorcycle-checklists/motorcycle-checklists.controller';
import { MotorcycleChecklistsService } from './motorcycle-checklists/motorcycle-checklists.service';
import { VacationSchedulesController } from './vacation-schedules/vacation-schedules.controller';
import { VacationSchedulesService } from './vacation-schedules/vacation-schedules.service';
import { TerminationsController } from './terminations/terminations.controller';
import { TerminationsService } from './terminations/terminations.service';
import { DisciplinaryWarningsController } from './disciplinary-warnings/disciplinary-warnings.controller';
import { DisciplinaryWarningsService } from './disciplinary-warnings/disciplinary-warnings.service';
import { FoodBasketsController } from './food-baskets/food-baskets.controller';
import { FoodBasketsService } from './food-baskets/food-baskets.service';
import { TalaoNumberService } from './services/talao-number.service'; 

@Module({
  controllers: [
    OccurrencesController,
    VehicleChecklistsController,
    SuppliesController,
    MotorizedServicesController,
    OccurrencesDispatchesController,
    DoormanChecklistsController,
    ArmamentChecklistsController,
    MotorcycleChecklistsController,
    VacationSchedulesController,
    TerminationsController,
    DisciplinaryWarningsController,
    FoodBasketsController,
  ],
  providers: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
    OccurrencesDispatchesService,
    DoormanChecklistsService,
    ArmamentChecklistsService,
    MotorcycleChecklistsService,
    VacationSchedulesService,
    TerminationsService,
    DisciplinaryWarningsService,
    FoodBasketsService,
    TalaoNumberService, 
  ],
  exports: [
    OccurrencesService,
    VehicleChecklistsService,
    SuppliesService,
    MotorizedServicesService,
    OccurrencesDispatchesService,
    DoormanChecklistsService,
    ArmamentChecklistsService,
    MotorcycleChecklistsService,
    VacationSchedulesService,
    TerminationsService,
    DisciplinaryWarningsService,
    FoodBasketsService,
    TalaoNumberService, 
  ],
})
export class ReportsModule {}
