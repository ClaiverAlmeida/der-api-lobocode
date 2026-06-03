export function buildPasswordChangedEmailHtml(params: {
  userName: string;
  logoUrl?: string;
}): string {
  const { userName, logoUrl } = params;
  const safeName = escapeHtml(userName);
  const logoBlock = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="DER" width="120" style="display:block;margin:0 auto 16px;" />`
    : `<div style="font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:1px;margin-bottom:16px;">DER</div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Senha alterada</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#eab308 0%,#ca8a04 100%);padding:28px 24px;text-align:center;">
              ${logoBlock}
              <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Departamento de Estradas de Rodagem</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">Senha alterada</h1>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#3f3f46;">Olá, ${safeName}.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3f3f46;">
                Sua senha de acesso ao sistema DER foi alterada com sucesso.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background:#fafafa;border:2px solid #22c55e;border-radius:8px;padding:20px;">
                    <p style="margin:0;font-size:15px;font-weight:600;color:#166534;">Alteração confirmada</p>
                    <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#3f3f46;">
                      Você já pode entrar com a nova senha.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#71717a;">
                Se você não realizou esta alteração, entre em contato com o suporte imediatamente.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                Por segurança, recomendamos não compartilhar sua senha com terceiros.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
