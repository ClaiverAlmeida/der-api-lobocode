import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError } from '../../shared/common/errors';
import { ConflictError, NotFoundError } from '../../shared/common/errors';
import {
  SUCCESS_MESSAGES,
  NOTIFICATION_MESSAGES,
} from '../../shared/common/messages';

import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';
import { ActionType, EntityName } from 'src/shared/universal/enums';
import { withDateFields } from '../../shared/common/utils';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
import { Roles } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ClientsHistoryService } from '../clients/services/clients-history.service';

const DATE_KEYS: (keyof CreateAppointmentsDto)[] = ['collectionDate'];

@Injectable({ scope: Scope.REQUEST })
export class AppointmentsService extends UniversalService<
  CreateAppointmentsDto,
  UpdateAppointmentsDto
> {
  private static readonly entityConfig = createEntityConfig('appointment');

  constructor(
    repository: UniversalRepository<
      CreateAppointmentsDto,
      UpdateAppointmentsDto
    >,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    private readonly prisma: PrismaService,
    private readonly clientsHistoryService: ClientsHistoryService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = AppointmentsService.entityConfig;
    super(
      repository,
      queryService,
      permissionService,
      metricsService,
      request,
      model,
      casl,
    );

    this.setEntityConfig();
  }

  setEntityConfig() {
    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        client: {
          select: {
            id: true,
            usaName: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      transform: {
        flatten: {},
        exclude: ['clientId', 'userId'],
      },
    };
  }

  /**
   * Busca agendamentos por data retornando apenas collectionDate e qtyBoxes.
   */
  async buscarPorData(date: string) {
    const result = await this.buscarMuitosPorCampo('collectionDate', date);
    const data = (result?.data ?? []).map((a: any) => ({
      collectionDate:
        typeof a.collectionDate === 'string'
          ? a.collectionDate.slice(0, 10)
          : a.collectionDate
            ? new Date(a.collectionDate).toISOString().slice(0, 10)
            : '',
      qtyBoxes: Number(a.qtyBoxes ?? 0),
    }));

    const qtyBoxes = data.reduce(
      (acc: number, curr: { qtyBoxes: number }) => acc + curr.qtyBoxes,
      0,
    );

    return { data: { collectionDate: date, qtyBoxes: qtyBoxes } };
  }

  async criar(data: CreateAppointmentsDto, include?: any, role?: Roles) {
    return super.criar(
      withDateFields(data, DATE_KEYS) as CreateAppointmentsDto,
      include,
      role,
    );
  }

  /** History Client - Create Appointment */
  async depoisDeCriar(data: any) {
    await this.clientsHistoryService.create(
      data.clientId,
      data.userId,
      data.id,
      EntityName.APPOINTMENT,
    );
  }
}
