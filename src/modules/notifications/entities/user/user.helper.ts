/**
 * 🔔 HELPER - USER
 * 
 * Helper específico para notificações de usuários.
 * Usa templates contextuais e sistema de destinatários inteligente.
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../shared/notification.service';
import { UserContextBuilder } from './user.context-builder';
import { NotificationRecipientsService } from '../../shared/notification.recipients';
import { UserTemplateService } from './user.templates';

@Injectable()
export class UserNotificationHelper {
  constructor(
    private notificationService: NotificationService,
    private contextBuilder: UserContextBuilder,
    private recipientsService: NotificationRecipientsService
  ) {}

  /**
   * 👥 USER CRIADO - Versão melhorada com templates
   */
  async userCriado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildUserContext(userId, 'created');
      
      // 2. Obter template
      const template = UserTemplateService.getTemplate('created');
      if (!template) {
        throw new Error('Template não encontrado para user.created');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = UserTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'user',
        entityId: userId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de user criado:', error);
      throw error;
    }
  }

  /**
   * 👥 USER ATUALIZADO - Versão melhorada com templates
   */
  async userAtualizado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildUserContext(userId, 'updated');
      
      // 2. Obter template
      const template = UserTemplateService.getTemplate('updated');
      if (!template) {
        throw new Error('Template não encontrado para user.updated');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = UserTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'user',
        entityId: userId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de user atualizado:', error);
      throw error;
    }
  }

  /**
   * 👥 USER DESATIVADO - Versão melhorada com templates
   */
  async userDesativado(
    userId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildUserContext(userId, 'deactivated');
      
      // 2. Obter template
      const template = UserTemplateService.getTemplate('deactivated');
      if (!template) {
        throw new Error('Template não encontrado para user.deactivated');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = UserTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'user',
        entityId: userId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de user desativado:', error);
      throw error;
    }
  }
}
