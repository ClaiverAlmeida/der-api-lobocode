/**
 * 🕐 TEMPLATES DE NOTIFICAÇÃO - SHIFT
 * 
 * Templates específicos para turnos (shifts).
 * Focado em empresa de segurança com informações contextuais.
 */

import { NotificationTemplate, NotificationContext } from '../../shared/notification.types';

/**
 * 🕐 TEMPLATES PARA SHIFT
 */
export const SHIFT_TEMPLATES: Record<string, NotificationTemplate> = {
  started: {
    title: "Turno Iniciado",
    message: "{userName} iniciou turno{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS_AND_HR" // RH + administradores
  },
  finished: {
    title: "Turno Finalizado", 
    message: "{userName} encerrou turno{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS_AND_HR" // RH + administradores
  },
  break_started: {
    title: "Turno em Intervalo",
    message: "{userName} iniciou intervalo{postName} às {time}",
    priority: "LOW",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS_AND_HR" // Supervisores ativos + admins
  },
  break_finished: {
    title: "Intervalo Finalizado",
    message: "{userName} retornou do intervalo{postName} às {time}",
    priority: "LOW", 
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS_AND_HR" // Supervisores ativos + admins
  }
};

/**
 * 🔧 SHIFT TEMPLATE SERVICE
 */
export class ShiftTemplateService {
  
  /**
   * Obtém template por operação
   */
  static getTemplate(operation: string): NotificationTemplate | null {
    const template = SHIFT_TEMPLATES[operation];
    if (!template) {
      console.warn(`Template não encontrado para operação: shift.${operation}`);
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
