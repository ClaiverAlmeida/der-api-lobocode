import {
  BadRequestException,
  Inject,
  Injectable,
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

@Injectable({ scope: Scope.REQUEST })
export class WorkOrdersService extends UniversalService<
  CreateWorkOrderDto,
  UpdateWorkOrderDto
> {
  private static readonly entityConfig = createEntityConfig('workOrder');
  private readonly detalhesInclude: Prisma.WorkOrderInclude = {
    asset: {
      select: {
        id: true,
        name: true,
        highway: true,
        km: true,
        direction: true,
        status: true,
      },
    },
    assignedToUser: {
      select: {
        id: true,
        name: true,
        role: true,
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
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
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
        asset: {
          select: {
            id: true,
            name: true,
            highway: true,
            km: true,
            direction: true,
            status: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            role: true,
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

  async atribuirResponsavel(id: string, dto: AssignWorkOrderDto) {
    const ordem = await this.buscarOrdemPorId(id);
    const responsavel = await this.buscarResponsavelValido(dto.assignedToUserId);
    const status = ordem.status === WorkOrderStatus.COMPLETED
      ? WorkOrderStatus.COMPLETED
      : WorkOrderStatus.ASSIGNED;

    await this.prisma.workOrder.update({
      where: { id: ordem.id },
      data: {
        assignedToUserId: responsavel.id,
        status,
        updatedBy: this.obterUsuarioLogadoId() ?? undefined,
        slaStatus: this.calcularSlaStatus(ordem.dueDate, status),
      },
    });

    await this.registrarComentarioAutomatico(
      ordem.id,
      `OS atribuída para ${responsavel.name}.`,
    );

    return this.buscarDetalhesPorId(ordem.id);
  }

  async iniciarTrabalho(id: string) {
    const ordem = await this.buscarOrdemPorId(id);

    if (!ordem.assignedToUserId) {
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
    if (data.assignedToUserId && !data.status) {
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
    if (data.assignedToUserId && !data.status) {
      data.status = WorkOrderStatus.ASSIGNED;
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

  protected async depoisDeCriar(data: {
    id: string;
    type: WorkOrderType;
    assignedToUser?: { name: string | null } | null;
  }): Promise<void> {
    await this.criarChecklistPadrao(data.id, data.type);
    await this.registrarComentarioAutomatico(data.id, 'OS criada.');

    if (data.assignedToUser?.name) {
      await this.registrarComentarioAutomatico(
        data.id,
        `OS atribuída para ${data.assignedToUser.name}.`,
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
        assignedToUser: {
          select: {
            id: true,
            name: true,
            role: true,
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
        role: { in: [Roles.DRIVER, Roles.LOGISTICS] },
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

  private async criarChecklistPadrao(id: string, type: WorkOrderType) {
    const labels = this.obterChecklistPadraoPorTipo(type);

    if (labels.length === 0) {
      return;
    }

    await this.prisma.workOrderChecklistItem.createMany({
      data: labels.map((label, index) => ({
        workOrderId: id,
        label,
        sortOrder: index + 1,
      })),
    });
  }

  private obterChecklistPadraoPorTipo(type: WorkOrderType): string[] {
    if (type === WorkOrderType.PREVENTIVE) {
      return [
        'Validar alimentação elétrica do ativo',
        'Inspecionar estrutura física e fixação',
        'Limpar lente e gabinete',
        'Executar teste funcional',
      ];
    }

    if (type === WorkOrderType.EMERGENCY) {
      return [
        'Identificar causa raiz da falha',
        'Restabelecer comunicação do ativo',
        'Validar transmissão de dados',
        'Registrar evidências da intervenção',
      ];
    }

    return [
      'Inspecionar ativo em campo',
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

    await this.prisma.workOrderComment.create({
      data: {
        workOrderId,
        authorId: autorId,
        text,
      },
    });
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

