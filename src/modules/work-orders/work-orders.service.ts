import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Optional,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  FileType,
  Prisma,
  Roles,
  UserStatus,
  WorkOrderSlaStatus,
  WorkOrderStatus,
  WorkOrderType,
} from '@prisma/client';
import { FilesService } from 'src/shared/files/services/files.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  UniversalService,
  UniversalRepository,
  UniversalMetricsService,
  UniversalQueryService,
  UniversalPermissionService,
  createEntityConfig,
} from 'src/shared/universal';
import { AssignWorkOrderDto } from './dto/assign-work-order.dto';
import { CompleteWorkOrderDto } from './dto/complete-work-order.dto';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { CreateWorkOrderCommentDto } from './dto/create-work-order-comment.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { UpdateWorkOrderChecklistItemDto } from './dto/update-work-order-checklist-item.dto';
import { CreateWorkOrderCheckListDto } from './dto/create-work-order-checklist-item.dto';

@Injectable({ scope: Scope.REQUEST })
export class WorkOrdersService extends UniversalService<
  CreateWorkOrderDto,
  UpdateWorkOrderDto
> {
  private static readonly entityConfig = createEntityConfig('workOrder');
  private pendingCreateAssigneeIds: string[] = [];
  private pendingUpdateAssigneeIds: string[] | null = null;

  private readonly detalhesInclude: any = {
    location: {
      include: {
        regional: {
          select: {
            id: true,
            name: true,
            region: true,
          },
        },
      },
    },
    assignees: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    },
    checklistItems: {
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    },
    comments: {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    },
    evidences: {
      include: {
        file: {
          select: {
            id: true,
            originalName: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    },
  };

  constructor(
    repository: UniversalRepository<CreateWorkOrderDto, UpdateWorkOrderDto>,
    queryService: UniversalQueryService,
    permissionService: UniversalPermissionService,
    metricsService: UniversalMetricsService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(FilesService) private readonly filesService: FilesService,
    @Optional() @Inject(REQUEST) request: any,
  ) {
    const { model, casl } = WorkOrdersService.entityConfig;
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
    const companyId = this.obterUsuarioLogado()?.companyId;

    this.entityConfig = {
      ...this.entityConfig,
      includes: {
        location: {
          include: {
            regional: {
              select: {
                id: true,
                name: true,
                region: true,
              },
            },
          },
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
      where: {
        deletedAt: null,
        ...(companyId && { companyId }),
      },
      orderBy: { createdAt: 'desc' },
    };
  }

  async buscarPorId(id: string, include?: Prisma.WorkOrderInclude) {
    const ordem = await super.buscarPorId(id, include ?? this.detalhesInclude);
    return this.normalizarDetalhesDaOrdem(ordem);
  }

  async buscarDetalhesPorId(id: string) {
    return this.buscarPorId(id, this.detalhesInclude);
  }

  async buscarPorLocalidade(locationId: string) {
    await this.buscarLocalidadeValida(locationId);
    return this.buscarMuitosPorCampo('locationId', locationId);
  }

  async atribuirResponsavel(id: string, dto: AssignWorkOrderDto) {
    const ordem = await this.buscarOrdemPorId(id);

    const userId = dto.assignedToUserIds?.[0];
    if (!userId) {
      throw new BadRequestException('Informe ao menos um responsável.');
    }
    const responsavel = await this.buscarResponsavelValido(userId);

    const jaExiste = ordem.assignees.some(
      (assignee) => assignee.userId === responsavel.id,
    );
    if (!jaExiste) {
      await this.prisma.workOrderAssignee.create({
        data: {
          workOrderId: ordem.id,
          userId: responsavel.id,
        },
      });
    }

    const status = ordem.status === WorkOrderStatus.COMPLETED
      ? WorkOrderStatus.COMPLETED
      : WorkOrderStatus.ASSIGNED;

    await this.prisma.workOrder.update({
      where: { id: ordem.id },
      data: {
        status,
        updatedBy: this.obterUsuarioLogadoId() ?? undefined,
        slaStatus: this.calcularSlaStatus(ordem.dueDate, status),
      },
    });

    await this.registrarComentarioAutomatico(
      ordem.id,
      jaExiste
        ? `Responsável ${responsavel.name} já estava vinculado à OS.`
        : `Responsável ${responsavel.name} adicionado à OS.`,
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  async removerResponsavel(id: string, userId: string) {
    const ordem = await this.buscarOrdemPorId(id);

    const existente = ordem.assignees.find((assignee) => assignee.userId === userId);
    if (!existente) {
      throw new NotFoundException('Responsável não encontrado na OS.');
    }

    await this.prisma.workOrderAssignee.delete({
      where: { id: existente.id },
    });

    const restantes = ordem.assignees.filter((assignee) => assignee.userId !== userId);
    const nextStatus =
      restantes.length === 0 && ordem.status === WorkOrderStatus.ASSIGNED
        ? WorkOrderStatus.PENDING
        : ordem.status;

    await this.prisma.workOrder.update({
      where: { id: ordem.id },
      data: {
        status: nextStatus,
        updatedBy: this.obterUsuarioLogadoId() ?? undefined,
        slaStatus: this.calcularSlaStatus(ordem.dueDate, nextStatus),
      },
    });

    const nome = existente.user?.name ?? 'Responsável';
    await this.registrarComentarioAutomatico(
      ordem.id,
      `Responsável ${nome} removido da OS.`,
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  async removerItemDoChecklist(id: string, itemId: string) {
    await this.buscarOrdemPorId(id);

    await this.prisma.$transaction(async (tx) => {
      const item = await tx.workOrderChecklistItem.findFirst({
        where: { id: itemId, workOrderId: id },
        select: { id: true },
      });

      if (!item) {
        throw new NotFoundException('Item de checklist não encontrado.');
      }

      await tx.workOrderChecklistItem.delete({
        where: { id: item.id },
      });

      await this.reordenarChecklist(id, tx);
    });

    return this.buscarDetalhesPorId(id);
  }

  async iniciarTrabalho(id: string) {
    const ordem = await this.buscarOrdemPorId(id);

    if (ordem.assignees.length === 0) {
      throw new BadRequestException(
        'A ordem de serviço precisa ter um responsável antes de iniciar.',
      );
    }

    if (ordem.status === WorkOrderStatus.COMPLETED) {
      throw new BadRequestException('A ordem de serviço já foi concluída.');
    }

    if (ordem.status === WorkOrderStatus.CANCELLED) {
      throw new BadRequestException('Não é possível iniciar uma ordem cancelada.');
    }

    await this.prisma.workOrder.update({
      where: { id: ordem.id },
      data: {
        status: WorkOrderStatus.IN_PROGRESS,
        updatedBy: this.obterUsuarioLogadoId() ?? undefined,
        slaStatus: this.calcularSlaStatus(
          ordem.dueDate,
          WorkOrderStatus.IN_PROGRESS,
        ),
      },
    });

    await this.registrarComentarioAutomatico(
      ordem.id,
      'Trabalho iniciado na ordem de serviço.',
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  async concluirOrdem(id: string, dto: CompleteWorkOrderDto) {
    const ordem = await this.buscarOrdemPorId(id);

    if (ordem.status === WorkOrderStatus.COMPLETED) {
      throw new BadRequestException('A ordem de serviço já foi concluída.');
    }

    await this.prisma.workOrder.update({
      where: { id: ordem.id },
      data: {
        status: WorkOrderStatus.COMPLETED,
        updatedBy: this.obterUsuarioLogadoId() ?? undefined,
        slaStatus: WorkOrderSlaStatus.OK,
      },
    });

    await this.registrarComentarioAutomatico(
      ordem.id,
      dto.resolutionNotes?.trim()
        ? `OS concluída. ${dto.resolutionNotes.trim()}`
        : 'OS concluída.',
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  async atualizarItemDoChecklist(
    id: string,
    itemId: string,
    dto: UpdateWorkOrderChecklistItemDto,
  ) {
    await this.buscarOrdemPorId(id);

    const item = await this.prisma.workOrderChecklistItem.findFirst({
      where: {
        id: itemId,
        workOrderId: id,
      },
    });

    if (!item) {
      throw new NotFoundException('Item de checklist não encontrado.');
    }

    await this.prisma.workOrderChecklistItem.update({
      where: { id: item.id },
      data: { isDone: dto.isDone },
    });

    return this.buscarDetalhesPorId(id);
  }

  async criarItemDoChecklist(id: string, dto: CreateWorkOrderCheckListDto) {
    await this.buscarOrdemPorId(id);

    await this.prisma.$transaction(async (tx) => {
      const checklistItems = await tx.workOrderChecklistItem.findMany({
        where: { workOrderId: id },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      });

      // Reorganiza antes de inserir para evitar buracos em cenários legados.
      await Promise.all(
        checklistItems.map((item, index) =>
          tx.workOrderChecklistItem.update({
            where: { id: item.id },
            data: { sortOrder: index + 1 },
          }),
        ),
      );

      await tx.workOrderChecklistItem.create({
        data: {
          workOrderId: id,
          label: dto.label,
          sortOrder: checklistItems.length + 1,
        },
      });
    });

    return this.buscarDetalhesPorId(id);
  }

  private async reordenarChecklist(
    workOrderId: string,
    tx: Prisma.TransactionClient,
  ) {
    const items = await tx.workOrderChecklistItem.findMany({
      where: { workOrderId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    await Promise.all(
      items.map((item, index) =>
        tx.workOrderChecklistItem.update({
          where: { id: item.id },
          data: { sortOrder: index + 1 },
        }),
      ),
    );
  }

  async criarComentario(id: string, dto: CreateWorkOrderCommentDto) {
    const ordem = await this.buscarOrdemPorId(id);
    const autorId = this.obterUsuarioLogadoId();

    if (!autorId) {
      throw new BadRequestException('Usuário autenticado não encontrado.');
    }

    await this.prisma.workOrderComment.create({
      data: {
        workOrderId: ordem.id,
        authorId: autorId,
        text: dto.text.trim(),
      },
    });

    return this.buscarDetalhesPorId(ordem.id);
  }

  async adicionarEvidencia(
    id: string,
    file: any,
    description?: string,
  ) {
    const ordem = await this.buscarOrdemPorId(id);
    const usuario = this.obterUsuarioLogado();

    const arquivo = await this.filesService.uploadFile(
      file,
      FileType.DOCUMENT,
      usuario?.companyId,
      usuario?.id,
      description,
    );

    await this.prisma.workOrderEvidence.create({
      data: {
        workOrderId: ordem.id,
        fileId: arquivo.id,
        description,
      },
    });

    await this.registrarComentarioAutomatico(
      ordem.id,
      `Evidência adicionada: ${arquivo.originalName}.`,
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  protected async antesDeCriar(data: CreateWorkOrderDto): Promise<void> {
    await this.buscarLocalidadeValida(data.locationId);

    const responsaveis = await this.resolverResponsaveisDoPayload(data);
    this.pendingCreateAssigneeIds = responsaveis.map((responsavel) => responsavel.id);

    delete (data as any).assignedToUserIds;

    if (this.pendingCreateAssigneeIds.length > 0 && !data.status) {
      data.status = WorkOrderStatus.ASSIGNED;
    }

    if (!data.status) {
      data.status = WorkOrderStatus.PENDING;
    }

    if (!data.slaDeadlineHours && data.dueDate) {
      data.slaDeadlineHours = this.calcularHorasRestantes(new Date(data.dueDate));
    }

    data.slaStatus = this.calcularSlaStatus(
      data.dueDate ? new Date(data.dueDate) : null,
      data.status,
    );
  }

  protected async antesDeAtualizar(
    _id: string,
    data: UpdateWorkOrderDto,
  ): Promise<void> {
    this.pendingUpdateAssigneeIds = null;

    if (data.locationId) {
      await this.buscarLocalidadeValida(data.locationId);
    }

    const payloadPossuiLista = Object.prototype.hasOwnProperty.call(
      data as object,
      'assignedToUserIds',
    );

    if (payloadPossuiLista) {
      const responsaveis = await this.resolverResponsaveisDoPayload(data);
      this.pendingUpdateAssigneeIds = responsaveis.map(
        (responsavel) => responsavel.id,
      );
      delete (data as any).assignedToUserIds;
      if (!data.status) {
        const companyId = this.obterCompanyId();
        const ordem = await this.repository.buscarPrimeiro('workOrder', {
          id: _id,
          deletedAt: null,
          ...(companyId && { companyId }),
        });
        if (
          ordem?.status === WorkOrderStatus.PENDING &&
          this.pendingUpdateAssigneeIds.length > 0
        ) {
          data.status = WorkOrderStatus.ASSIGNED;
        } else if (
          ordem?.status === WorkOrderStatus.ASSIGNED &&
          this.pendingUpdateAssigneeIds.length === 0
        ) {
          data.status = WorkOrderStatus.PENDING;
        }
      }
    }

    if (data.status === WorkOrderStatus.COMPLETED) {
      data.slaStatus = WorkOrderSlaStatus.OK;
      return;
    }

    if (data.dueDate || data.status) {
      data.slaStatus = this.calcularSlaStatus(
        data.dueDate ? new Date(data.dueDate) : null,
        data.status,
      );
    }
  }

  protected async depoisDeAtualizar(
    id: string,
    _data: UpdateWorkOrderDto,
  ): Promise<void> {
    if (this.pendingUpdateAssigneeIds === null) {
      return;
    }

    await this.sincronizarResponsaveis(id, this.pendingUpdateAssigneeIds);

    this.pendingUpdateAssigneeIds = null;
  }

  protected async depoisDeCriar(data: {
    id: string;
    type: WorkOrderType;
  }): Promise<void> {
    try {
      await this.sincronizarResponsaveis(data.id, this.pendingCreateAssigneeIds);
      await this.criarChecklistPadrao(data.id, data.type);
      await this.registrarComentarioAutomatico(data.id, 'OS criada.');

      if (this.pendingCreateAssigneeIds.length > 0) {
        const responsaveis = await this.prisma.user.findMany({
          where: { id: { in: this.pendingCreateAssigneeIds } },
          select: { name: true },
        });
        const nomes = responsaveis
          .map((responsavel) => responsavel.name)
          .filter(Boolean)
          .join(', ');

        await this.registrarComentarioAutomatico(
          data.id,
          `OS atribuída para: ${nomes}.`,
        );
      }

      this.pendingCreateAssigneeIds = [];
    } catch (error) {
      console.error(
        '[WorkOrdersService] depoisDeCriar falhou',
        JSON.stringify({
          workOrderId: data.id,
          workOrderType: data.type,
          assignedToUserIds: this.pendingCreateAssigneeIds,
        }),
        error,
      );

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Falha ao inicializar checklist/comentários da ordem de serviço: ${errorMessage}`,
      );
    }
  }

  private async buscarOrdemPorId(id: string) {
    const companyId = this.obterCompanyId();
    const whereClause: Prisma.WorkOrderWhereInput = {
      id,
      deletedAt: null,
      ...(companyId && { companyId }),
    };

    const ordem = await this.prisma.workOrder.findFirst({
      where: whereClause,
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!ordem) {
      throw new NotFoundException('Ordem de serviço não encontrada.');
    }

    return ordem;
  }

  private async buscarResponsavelValido(userId: string) {
    const companyId = this.obterCompanyId();
    const responsavel = await this.prisma.user.findFirst({
      where: {
        id: userId,
        status: UserStatus.ACTIVE,
        role: { in: [Roles.INSPETOR_VIA, Roles.OPERADOR] },
        ...(companyId && { companyId }),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!responsavel) {
      throw new NotFoundException('Responsável não encontrado ou inativo.');
    }

    return responsavel;
  }

  private async buscarLocalidadeValida(locationId: string) {
    const companyId = this.obterCompanyId();
    const location = await this.repository.buscarPrimeiro('location', {
      id: locationId,
      deletedAt: null,
      ...(companyId && { companyId }),
    });

    if (!location) {
      throw new NotFoundException('Localidade não encontrada.');
    }

    return location;
  }

  private async resolverResponsaveisDoPayload(
    data: Pick<CreateWorkOrderDto, 'assignedToUserIds'>,
  ) {
    const ids = Array.from(
      new Set(
        [...(data.assignedToUserIds ?? [])]
          .filter(Boolean)
          .map((value) => String(value).trim()),
      ),
    ).filter(Boolean);

    if (ids.length === 0) {
      return [];
    }

    const responsaveis = await Promise.all(
      ids.map((userId) => this.buscarResponsavelValido(userId)),
    );

    return responsaveis;
  }

  private async sincronizarResponsaveis(workOrderId: string, userIds: string[]) {
    await this.prisma.workOrderAssignee.deleteMany({
      where: { workOrderId },
    });

    if (userIds.length > 0) {
      await this.prisma.workOrderAssignee.createMany({
        data: userIds.map((userId) => ({
          workOrderId,
          userId,
        })),
      });
    }

  }

  private async criarChecklistPadrao(id: string, type: WorkOrderType) {
    const labels = this.obterChecklistPadraoPorTipo(type);

    if (labels.length === 0) {
      return;
    }

    await this.repository.atualizar(
      'workOrder',
      { id },
      {
        checklistItems: {
          create: labels.map((label, index) => ({
            label,
            sortOrder: index + 1,
          })),
        },
      } as any,
    );
  }

  private obterChecklistPadraoPorTipo(type: WorkOrderType): string[] {
    if (type === WorkOrderType.PREVENTIVE) {
      return [
        'Validar alimentação elétrica do ponto de intervenção',
        'Inspecionar estrutura física e fixação do local',
        'Limpar lente e gabinete',
        'Executar teste funcional',
      ];
    }

    if (type === WorkOrderType.EMERGENCY) {
      return [
        'Identificar causa raiz da falha',
        'Restabelecer comunicação do ponto afetado',
        'Validar transmissão de dados',
        'Registrar evidências da intervenção',
      ];
    }

    return [
      'Inspecionar ponto de intervenção em campo',
      'Executar correção necessária',
      'Validar retorno da operação',
      'Registrar observações finais',
    ];
  }

  private async registrarComentarioAutomatico(
    workOrderId: string,
    text: string,
  ): Promise<void> {
    const autorId = this.obterUsuarioLogadoId();

    if (!autorId) {
      return;
    }

    await this.repository.atualizar(
      'workOrder',
      { id: workOrderId },
      {
        comments: {
          create: {
            author: { connect: { id: autorId } },
            text,
          },
        },
      } as any,
    );
  }

  private normalizarDetalhesDaOrdem<T>(ordem: T): T {
    if (!ordem || typeof ordem !== 'object') {
      return ordem;
    }

    const ordemNormalizada = ordem as T & {
      checklistItems?: unknown[];
      comments?: unknown[];
      evidences?: unknown[];
    };

    return {
      ...ordemNormalizada,
      checklistItems: Array.isArray(ordemNormalizada.checklistItems)
        ? ordemNormalizada.checklistItems
        : [],
      comments: Array.isArray(ordemNormalizada.comments)
        ? ordemNormalizada.comments
        : [],
      evidences: Array.isArray(ordemNormalizada.evidences)
        ? ordemNormalizada.evidences
        : [],
    };
  }

  private calcularSlaStatus(
    dueDate?: Date | null,
    status?: WorkOrderStatus,
  ): WorkOrderSlaStatus {
    if (
      status === WorkOrderStatus.COMPLETED ||
      status === WorkOrderStatus.CANCELLED
    ) {
      return WorkOrderSlaStatus.OK;
    }

    if (!dueDate) {
      return WorkOrderSlaStatus.OK;
    }

    const horasRestantes = this.calcularHorasRestantes(dueDate);

    if (horasRestantes <= 0) {
      return WorkOrderSlaStatus.OVERDUE;
    }

    if (horasRestantes <= 6) {
      return WorkOrderSlaStatus.WARNING;
    }

    return WorkOrderSlaStatus.OK;
  }

  private calcularHorasRestantes(dueDate: Date): number {
    const diferenca = dueDate.getTime() - Date.now();
    return Math.ceil(diferenca / (1000 * 60 * 60));
  }
}

