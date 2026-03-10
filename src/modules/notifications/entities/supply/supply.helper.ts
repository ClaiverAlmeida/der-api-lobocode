/**
 * 🔔 HELPER - SUPPLY
 * 
 * Helper específico para notificações de abastecimentos.
 * Usa templates contextuais e sistema de destinatários inteligente.
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../shared/notification.service';
import { SupplyContextBuilder } from './supply.context-builder';
import { NotificationRecipientsService } from '../../shared/notification.recipients';
import { SupplyTemplateService } from './supply.templates';  

@Injectable()
export class SupplyNotificationHelper {
  constructor(
    private notificationService: NotificationService,
    private contextBuilder: SupplyContextBuilder,
    private recipientsService: NotificationRecipientsService
  ) {}

  /**
   * 📋 SUPPLY CRIADO - Versão melhorada com templates
   */
  async supplyCriado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildSupplyContext(supplyId, 'created');
      
      // 2. Obter template
      const template = SupplyTemplateService.getTemplate('created');
      if (!template) {
        throw new Error('Template não encontrado para supply.created');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = SupplyTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'supply',
        entityId: supplyId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de supply criado:', error);
      throw error;
    }
  }

  /**
   * 📋 SUPPLY ATUALIZADO - Versão melhorada com templates
   */
  async supplyAtualizado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildSupplyContext(supplyId, 'updated');
      
      // 2. Obter template
      const template = SupplyTemplateService.getTemplate('updated');
      if (!template) {
        throw new Error('Template não encontrado para supply.updated');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = SupplyTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'supply',
        entityId: supplyId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de supply atualizado:', error);
      throw error;
    }
  }

  /**
   * 📋 SUPPLY FINALIZADO - Versão melhorada com templates
   */
  async supplyFinalizado(
    supplyId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildSupplyContext(supplyId, 'completed');
      
      // 2. Obter template
      const template = SupplyTemplateService.getTemplate('completed');
      if (!template) {
        throw new Error('Template não encontrado para supply.completed');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = SupplyTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'supply',
        entityId: supplyId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de supply finalizado:', error);
      throw error;
    }
  }
}
