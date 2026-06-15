/**
 * TEMPORÁRIO: e-mails de notificação desativados por padrão (WebSocket + push ativos).
 * Recuperação de senha (`sendPasswordResetEmail`) não passa por este fluxo.
 * Para reativar e-mail em um fluxo específico, passe `skipEmail: false` em `criar()`.
 */
export const SKIP_NOTIFICATION_EMAIL_BY_DEFAULT = true;
