/**
 * 🔫 TEMPLATES DE NOTIFICAÇÃO - ARMAMENT CHECKLIST
 * 
 * Templates específicos para checklist de armamento.
 * Focado em empresa de segurança com informações contextuais.
 */

import { NotificationTemplate, NotificationContext } from '../../shared/notification.types';

/**
 * 🔫 TEMPLATES PARA ARMAMENT CHECKLIST
 */
export const ARMAMENT_CHECKLIST_TEMPLATES: Record<string, NotificationTemplate> = {
  created: {
    title: "Novo Checklist de Armamento",
    message: "{userName} criou checklist de armamento{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  },
  updated: {
    title: "Checklist de Armamento Atualizado",
    message: "{userName} atualizou checklist de armamento{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  },
  completed: {
    title: "Checklist de Armamento Concluído",
    message: "{userName} concluiu checklist de armamento{postName} às {time}",
    priority: "NORMAL",
    recipients: "ACTIVE_SUPERVISORS_AND_ADMINS" // Supervisores ativos + admins
  }
};

/**
 * 🔧 ARMAMENT CHECKLIST TEMPLATE SERVICE
 */
export class ArmamentChecklistTemplateService {
  
  /**
   * Obtém template por operação
   */
  static getTemplate(operation: string): NotificationTemplate | null {
    const template = ARMAMENT_CHECKLIST_TEMPLATES[operation];
    if (!template) {
      console.warn(`Template não encontrado para operação: armamentChecklist.${operation}`);
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
