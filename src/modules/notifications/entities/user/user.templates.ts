/**
 * 👥 TEMPLATES DE NOTIFICAÇÃO - USER
 * 
 * Templates específicos para usuários.
 * Focado em empresa de segurança com informações contextuais.
 */

import { NotificationTemplate, NotificationContext } from '../../shared/notification.types';

/**
 * 👥 TEMPLATES PARA USER
 */
export const USER_TEMPLATES: Record<string, NotificationTemplate> = {
  created: {
    title: "Novo Usuário Criado",
    message: "Usuário {userName} foi criado no sistema às {time}",
    priority: "NORMAL",
    recipients: "ADMINS_AND_SUPERVISORS" // Administradores e supervisores
  },
  updated: {
    title: "Usuário Atualizado",
    message: "Dados do usuário {userName} foram atualizados às {time}",
    priority: "LOW",
    recipients: "ADMINS_AND_SUPERVISORS" // Administradores e supervisores
  },
  deactivated: {
    title: "Usuário Desativado",
    message: "Usuário {userName} foi desativado às {time}",
    priority: "HIGH",
    recipients: "ADMINS_AND_SUPERVISORS" // Administradores e supervisores
  }
};

/**
 * 🔧 USER TEMPLATE SERVICE
 */
export class UserTemplateService {
  
  /**
   * Obtém template por operação
   */
  static getTemplate(operation: string): NotificationTemplate | null {
    const template = USER_TEMPLATES[operation];
    if (!template) {
      console.warn(`Template não encontrado para operação: user.${operation}`);
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
