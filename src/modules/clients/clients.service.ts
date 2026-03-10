import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError } from '../../shared/common/errors';
import { CreateClientsDto } from './dto/create-clients.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { ConflictError, NotFoundError } from '../../shared/common/errors';
import {
  SUCCESS_MESSAGES,
  NOTIFICATION_MESSAGES,
} from '../../shared/common/messages';
import { ClientsHistoryService } from './services/clients-history.service';
import { ClientStatus } from '@prisma/client';

import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from '../../shared/universal/index';
import { ActionType, EntityName } from 'src/shared/universal/enums';

@Injectable({ scope: Scope.REQUEST })
export class ClientsService extends UniversalService<
  CreateClientsDto,
  UpdateClientsDto
> {
  private static readonly entityConfig = createEntityConfig('client');

  constructor(
    repository: UniversalRepository<CreateClientsDto, UpdateClientsDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Optional() @Inject(REQUEST) request: any,
    private readonly clientsHistoryService: ClientsHistoryService,
  ) {
    const { model, casl } = ClientsService.entityConfig;
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
        company: {
          select: {
            id: true,
            name: true,
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
        exclude: ['userId'],
      },
      where: (() => {
        const companyId = this.obterUsuarioLogado()?.companyId;
        return {
          deletedAt: null,
          ...(companyId && { companyId }),
        };
      })(),
    };
  }

  async export() {
    const companyId = this.obterUsuarioLogado()?.companyId;
    const where: {
      status: ClientStatus;
      companyId?: string;
      deletedAt?: null;
    } = { status: ClientStatus.ACTIVE, deletedAt: null };
    if (companyId) where.companyId = companyId;
    const clients = await this.repository.buscarMuitos(this.entityName, where);
    return clients;
  }

  protected async antesDeCriar(data: CreateClientsDto): Promise<void> {
    if (data.usaCpf) {
      // if(data.cpf === data.brazilDestination.cpfRecebedor) {
      //   throw new ConflictError('O CPF do destinatário não pode ser o mesmo do cliente.');
      // }
      await this.validarCPFUnico(data.usaCpf);
    }
  }

  private updateChanges?: Record<string, { before?: unknown; after?: unknown }>;

  protected async antesDeAtualizar(
    id: string,
    data: UpdateClientsDto,
  ): Promise<void> {
    if (data.usaCpf) {
      await this.validarCPFUnico(data.usaCpf, id);
    }
  }

  async atualizar(
    id: string,
    data: UpdateClientsDto,
    changes?: Record<string, { before?: unknown; after?: unknown }>,
  ) {
    this.updateChanges = changes;
    return super.atualizar(id, data);
  }

  protected async depoisDeCriar(
    data: CreateClientsDto & { id: string; companyId: string },
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    await this.clientsHistoryService.create(
      data.id,
      user.id,
      null,
      EntityName.CLIENT,
    );
  }

  protected async depoisDeAtualizar(
    id: string,
    data: UpdateClientsDto,
  ): Promise<void> {
    const user = this.obterUsuarioLogado();
    await this.clientsHistoryService.update(
      id,
      user.id,
      null,
      EntityName.CLIENT,
      this.updateChanges,
    );
    this.updateChanges = undefined;
  }

  protected async depoisDeDesativar(id: string) {
    const user = this.obterUsuarioLogado();
    await this.clientsHistoryService.delete(
      id,
      user.id,
      null,
      EntityName.CLIENT,
    );
  }

  /** Valida se o CPF (EUA) já está em uso por outro cliente. No update, exclui o próprio registro. */
  private async validarCPFUnico(
    cpf: string,
    excludeClientId?: string,
  ): Promise<void> {
    const where: { usaCpf: string; id?: { not: string }; companyId?: string } =
      { usaCpf: cpf };
    if (excludeClientId) {
      where.id = { not: excludeClientId };
    }
    const companyId = this.obterUsuarioLogado()?.companyId;
    if (companyId) where.companyId = companyId;
    const existente = await this.repository.buscarPrimeiro(
      this.entityName,
      where,
    );
    if (existente) {
      throw new ConflictError('CPF já está em uso por outro cliente.');
    }
  }
}
