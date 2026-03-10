/**
 * 🔔 HELPER - MOTORIZED SERVICE
 * 
 * Helper específico para notificações de serviços motorizados.
 * Usa templates contextuais e sistema de destinatários inteligente.
 */

import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../shared/notification.service';
import { MotorizedServiceContextBuilder } from './motorized-service.context-builder';
import { NotificationRecipientsService } from '../../shared/notification.recipients';
import { MotorizedServiceTemplateService } from './motorized-service.templates';

@Injectable()
export class MotorizedServiceNotificationHelper {
  constructor(
    private notificationService: NotificationService,
    private contextBuilder: MotorizedServiceContextBuilder,
    private recipientsService: NotificationRecipientsService
  ) {}

  /**
   * 🚛 MOTORIZED SERVICE CRIADO - Versão melhorada com templates
   */
  async motorizedServiceCriado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildMotorizedServiceContext(serviceId, 'created');
      
      // 2. Obter template
      const template = MotorizedServiceTemplateService.getTemplate('created');
      if (!template) {
        throw new Error('Template não encontrado para motorizedService.created');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = MotorizedServiceTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'motorizedService',
        entityId: serviceId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de motorizedService criado:', error);
      throw error;
    }
  }

  /**
   * 🚛 MOTORIZED SERVICE ATUALIZADO - Versão melhorada com templates
   */
  async motorizedServiceAtualizado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildMotorizedServiceContext(serviceId, 'updated');
      
      // 2. Obter template
      const template = MotorizedServiceTemplateService.getTemplate('updated');
      if (!template) {
        throw new Error('Template não encontrado para motorizedService.updated');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = MotorizedServiceTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'motorizedService',
        entityId: serviceId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de motorizedService atualizado:', error);
      throw error;
    }
  }

  /**
   * 🚛 MOTORIZED SERVICE FINALIZADO - Versão melhorada com templates
   */
  async motorizedServiceFinalizado(
    serviceId: string,
    criadoPorUserId: string,
    companyId: string,
  ) {
    try {
      // 1. Construir contexto rico
      const context = await this.contextBuilder.buildMotorizedServiceContext(serviceId, 'completed');
      
      // 2. Obter template
      const template = MotorizedServiceTemplateService.getTemplate('completed');
      if (!template) {
        throw new Error('Template não encontrado para motorizedService.completed');
      }

      // 3. Renderizar template com contexto
      const renderedTemplate = MotorizedServiceTemplateService.renderTemplate(template, context);

      // 4. Obter destinatários
      const recipients = await this.recipientsService.getRecipients(companyId, template.recipients);

      // 5. Criar notificação
      return this.notificationService.criar({
        title: renderedTemplate.title,
        message: renderedTemplate.message,
        entityType: 'motorizedService',
        entityId: serviceId,
        userId: criadoPorUserId,
        companyId,
        priority: renderedTemplate.priority,
        recipients,
      });
    } catch (error) {
      console.error('Erro ao criar notificação de motorizedService finalizado:', error);
      throw error;
    }
  }
}
