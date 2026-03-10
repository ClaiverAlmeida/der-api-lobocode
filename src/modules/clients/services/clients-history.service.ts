import { Injectable, Inject, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { EntityName, ActionType } from '../../../shared/universal/enums';
import { HISTORY_MESSAGES } from 'src/shared/common/messages';

@Injectable({ scope: Scope.REQUEST })
export class ClientsHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async register(
    clientId: string,
    ownerId: string | null,
    entityId: string | null,
    entityType: EntityName,
    actionType: ActionType,
    message?: string,
    fieldsChanged?: Record<string, { before?: unknown; after?: unknown }>,
  ) {
    const messageRegister = message || HISTORY_MESSAGES[entityType][actionType];

    return await this.prisma.clientHistory.create({
      data: {
        clientId,
        ownerId,
        entityId,
        entityType,
        actionType,
        message: messageRegister,
        ...(fieldsChanged && { fieldsChanged: fieldsChanged as object }),
      },
    });
  }

  async create(
    clientId: string,
    ownerId: string,
    entityId: string | null,
    entityType: EntityName,
  ) {
    return await this.register(
      clientId,
      ownerId,
      entityId,
      entityType,
      ActionType.CREATED,
    );
  }

  async update(
    clientId: string,
    ownerId: string,
    entityId: string | null,
    entityType: EntityName,
    fieldsChanged?: Record<string, { before?: unknown; after?: unknown }>,
  ) {
    return await this.register(
      clientId,
      ownerId,
      entityId,
      entityType,
      ActionType.UPDATED,
      undefined,
      fieldsChanged,
    );
  }

  async delete(
    clientId: string,
    ownerId: string,
    entityId: string | null,
    entityType: EntityName,
  ) {
    return await this.register(
      clientId,
      ownerId,
      entityId,
      entityType,
      ActionType.DELETED,
    );
  }

  async others(
    clientId: string,
    ownerId: string,
    entityId: string | null,
    entityType: EntityName,
    actionType: ActionType,
  ) {
    //TODO - Regra de negócio para trazer dados complementares
    // Container #12345 em preparação - Exemplo
    const message = HISTORY_MESSAGES[entityType][actionType];

    return await this.register(
      clientId,
      ownerId,
      entityId,
      entityType,
      actionType,
      message,
    );
  }

  async getAll(
    clientId: string,
    page = 1,
    limit = 5,
  ): Promise<{
    data: Array<{
      id: string;
      clientId: string;
      entityId: string | null;
      entityType: string | null;
      actionType: string | null;
      message: string;
      createdAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where = { clientId };

    const [data, total] = await Promise.all([
      this.prisma.clientHistory.findMany({
        where,
        select: {
          id: true,
          clientId: true,
          entityId: true,
          entityType: true,
          actionType: true,
          message: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.clientHistory.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
