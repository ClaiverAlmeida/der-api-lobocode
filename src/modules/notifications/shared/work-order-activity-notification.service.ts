import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WorkOrderStatus } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { NotificationService } from './notification.service';
import { ActivityNotificationPreferencesService } from './activity-notification-preferences.service';

@Injectable()
export class WorkOrderActivityNotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly preferencesService: ActivityNotificationPreferencesService,
  ) {}

  async notifyAssignment(params: {
    workOrderId: string;
    workOrderTitle: string;
    actorUserId: string;
    companyId?: string;
    assignedUserId: string;
  }) {
    const recipients =
      await this.preferencesService.filtrarUsuariosComPreferenciaAtiva(
        [params.assignedUserId],
        'assignments',
      );
    if (recipients.length === 0) return;

    await this.notificationService.criar({
      title: 'Nova tarefa atribuída a você',
      message: `Você foi atribuído à OS "${params.workOrderTitle}".`,
      entityType: 'work-order',
      entityId: params.workOrderId,
      userId: params.actorUserId,
      companyId: params.companyId,
      recipients,
    });
  }

  async notifyNewComment(params: {
    workOrderId: string;
    workOrderTitle: string;
    actorUserId: string;
    companyId?: string;
    assigneeUserIds: string[];
  }) {
    const baseRecipients = params.assigneeUserIds.filter(
      (id) => id !== params.actorUserId,
    );
    const recipients =
      await this.preferencesService.filtrarUsuariosComPreferenciaAtiva(
        baseRecipients,
        'comments',
      );
    if (recipients.length === 0) return;

    await this.notificationService.criar({
      title: 'Novo comentário em sua tarefa',
      message: `A OS "${params.workOrderTitle}" recebeu um novo comentário.`,
      entityType: 'work-order',
      entityId: params.workOrderId,
      userId: params.actorUserId,
      companyId: params.companyId,
      recipients,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async notifyUpcomingDeadlines() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const workOrders = await this.prisma.workOrder.findMany({
      where: {
        deletedAt: null,
        dueDate: {
          gte: now,
          lte: in24h,
        },
        status: {
          notIn: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED],
        },
      },
      select: {
        id: true,
        title: true,
        companyId: true,
        assignees: {
          select: {
            userId: true,
          },
        },
      },
    });

    for (const order of workOrders) {
      const recipients =
        await this.preferencesService.filtrarUsuariosComPreferenciaAtiva(
          order.assignees.map((a) => a.userId),
          'deadlines',
        );
      if (recipients.length === 0) continue;

      await this.notificationService.criar({
        title: 'Prazo próximo',
        message: `A OS "${order.title}" vence nas próximas 24 horas.`,
        entityType: 'work-order-deadline',
        entityId: order.id,
        userId: 'system',
        companyId: order.companyId,
        recipients,
      });
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async notifyWeeklyReports() {
    const users = await this.prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: {
        id: true,
        companyId: true,
      },
    });

    const byCompany = new Map<string, string[]>();
    users.forEach((user) => {
      const ids = byCompany.get(user.companyId) ?? [];
      ids.push(user.id);
      byCompany.set(user.companyId, ids);
    });

    for (const [companyId, userIds] of byCompany.entries()) {
      const recipients =
        await this.preferencesService.filtrarUsuariosComPreferenciaAtiva(
          userIds,
          'reports',
        );
      if (recipients.length === 0) continue;

      await this.notificationService.criar({
        title: 'Relatório semanal disponível',
        message: 'Seu resumo semanal de atividades já está disponível.',
        entityType: 'weekly-report',
        entityId: `week-${new Date().toISOString().slice(0, 10)}`,
        userId: 'system',
        companyId,
        recipients,
      });
    }
  }
}
