/**
 * 🚶 TEMPLATES DE NOTIFICAÇÃO - PATROL
 * 
 * Templates específicos para Rondas.
 * Focado em empresa de segurança com informações contextuais.
 */

import { NotificationTemplate, NotificationContext } from '../../shared/notification.types';

/**
 * 🚶 TEMPLATES PARA PATROL
 */
export const PATROL_TEMPLATES: Record<string, NotificationTemplate> = {
  started: {
    title: "Ronda Iniciada",
    message: "{userName} iniciou Ronda{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  },
  completed: {
    title: "Ronda Concluída", 
    message: "{userName} concluiu Ronda{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  },
  checkpoint_reached: {
    title: "Checkpoint Alcançado",
    message: "{userName} alcançou checkpoint na Ronda{postName} às {time}",
    priority: "LOW",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  },
  checkpoint_missed: {
    title: "Checkpoint Perdido",
    message: "{userName} perdeu checkpoint na Ronda{postName} às {time}",
    priority: "HIGH",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  }
};

/**
 * 🔧 PATROL TEMPLATE SERVICE
 */
export class PatrolTemplateService {
  
  /**
   * Obtém template por operação
   */
  static getTemplate(operation: string): NotificationTemplate | null {
    const template = PATROL_TEMPLATES[operation];
    if (!template) {
      console.warn(`Template não encontrado para operação: patrol.${operation}`);
      return null;
    }
    return template;
  }

  /**
   * Substitui variáveis no template
   */
  static renderTemplate(template: NotificationTemplate, context: NotificationContext): NotificationTemplate {
    const renderText = (text: string): string => {
      return text.replace(/\{(\w+)\}/g, (match, key) => {
        const value = context[key as keyof NotificationContext];
        return value !== undefined ? String(value) : match;
      });
    };

    return {
      ...template,
      title: renderText(template.title),
      message: renderText(template.message)
    };
  }

  /**
   * Valida se todas as variáveis necessárias estão presentes
   */
  static validateContext(template: NotificationTemplate, context: NotificationContext): string[] {
    const missingVars: string[] = [];
    const requiredVars = this.extractVariables(template);

    for (const varName of requiredVars) {
      if (context[varName as keyof NotificationContext] === undefined) {
        missingVars.push(varName);
      }
    }

    return missingVars;
  }

  /**
   * Extrai variáveis do template
   */
  private static extractVariables(template: NotificationTemplate): string[] {
    const variables = new Set<string>();
    const text = `${template.title} ${template.message}`;
    
    const matches = text.match(/\{(\w+)\}/g);
    if (matches) {
      matches.forEach(match => {
        variables.add(match.slice(1, -1)); // Remove { }
      });
    }

    return Array.from(variables);
  }
}
