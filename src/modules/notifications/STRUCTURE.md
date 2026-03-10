# 🏗️ ESTRUTURA MODULAR DE NOTIFICAÇÕES

## 📁 Organização por Entidade

A estrutura foi reorganizada para evitar arquivos gigantescos e facilitar a manutenção:

```
notifications/
├── shared/                          # Arquivos compartilhados
│   ├── notification.types.ts       # Tipos e interfaces
│   ├── notification.service.ts     # Serviço principal
│   ├── notification.recipients.ts  # Sistema de destinatários
│   └── date-formatter.ts          # Formatador de datas centralizado
├── entities/                        # Por entidade
│   ├── supply/                     # Abastecimentos
│   │   ├── supply.templates.ts    # Templates específicos
│   │   ├── supply.context-builder.ts # Context builder
│   │   ├── supply.helper.ts      # Helper específico
│   │   └── index.ts               # Exports centralizados
│   ├── shift/                      # Turnos
│   │   ├── shift.templates.ts
│   │   ├── shift.context-builder.ts
│   │   ├── shift.helper.ts
│   │   └── index.ts
│   └── index.ts                    # Exports de todas as entidades
├── notification.helper.ts          # Helper principal (delegação)
├── notification.module.ts          # Módulo principal
└── notification.gateway.ts         # WebSocket gateway
```

## 🎯 Vantagens da Nova Estrutura

### ✅ **Modularidade**
- Cada entidade tem seus próprios arquivos
- Fácil de encontrar e modificar código específico
- Não há mais arquivos gigantescos

### ✅ **Manutenibilidade**
- Mudanças em uma entidade não afetam outras
- Templates específicos por entidade
- Context builders especializados

### ✅ **Escalabilidade**
- Fácil adicionar novas entidades
- Padrão consistente para todas as entidades
- Reutilização de código compartilhado

### ✅ **Compatibilidade**
- `NotificationHelper` principal mantém a mesma API
- Delegação transparente para helpers específicos
- Código existente continua funcionando

## 🔧 Como Adicionar Nova Entidade

### 1. Criar estrutura da entidade:
```bash
mkdir -p entities/nova-entidade
```

### 2. Criar arquivos:
- `nova-entidade.templates.ts` - Templates específicos
- `nova-entidade.context-builder.ts` - Context builder
- `nova-entidade.helper.ts` - Helper específico
- `index.ts` - Exports

### 3. Atualizar `notification.helper.ts`:
```typescript
// Importar novo helper
import { NovaEntidadeNotificationHelper } from './entities/nova-entidade';

// Adicionar ao constructor
constructor(
  // ... outros helpers
  private novaEntidadeHelper: NovaEntidadeNotificationHelper
) {}

// Delegar métodos
async novaEntidadeCriada(...) {
  return this.novaEntidadeHelper.novaEntidadeCriada(...);
}
```

### 4. Atualizar `notification.module.ts`:
```typescript
// Adicionar imports
import { NovaEntidadeNotificationHelper, NovaEntidadeContextBuilder } from './entities/nova-entidade';

// Adicionar aos providers e exports
providers: [
  // ... outros providers
  NovaEntidadeNotificationHelper,
  NovaEntidadeContextBuilder,
],
```

## 📋 Exemplo de Uso

### No Service da Entidade:
```typescript
@Injectable()
export class MeuService extends UniversalService {
  constructor(
    // ... outros services
    private notificationHelper: NotificationHelper
  ) {}

  protected async depoisDeCriar(data: MinhaEntidade): Promise<void> {
    // Notificação automática com template contextual
    await this.notificationHelper.minhaEntidadeCriada(
      data.id,
      this.obterUsuarioLogado().id,
      this.obterCompanyId() || ''
    );
  }
}
```

## 🎨 Templates Contextuais

Cada entidade tem templates específicos com variáveis contextuais:

```typescript
// supply.templates.ts
export const SUPPLY_TEMPLATES = {
  created: {
    title: "Novo Abastecimento Registrado",
    message: "{userName} registrou abastecimento de {postName} às {time} (Placa: {vehiclePlate}, Talão: {talaoNumber})",
    priority: "NORMAL",
    recipients: "ALL"
  }
};
```

## 📅 Formatador de Datas Centralizado

Utilitário centralizado para formatação de datas em todas as entidades:

```typescript
import { DateFormatter } from '../shared/date-formatter';

// Formato: "04:13 do dia 06/10/2025"
const time = DateFormatter.formatDateTime(new Date());

// Formato: "06/10/2025"
const date = DateFormatter.formatDate(new Date());

// Formato: "04:13"
const timeOnly = DateFormatter.formatTime(new Date());

// Formato relativo: "há 2 horas", "há 1 dia"
const relative = DateFormatter.formatRelative(new Date());
```

## 🔄 Sistema de Destinatários

Sistema inteligente de destinatários baseado em regras:

- `ALL` - Todos os usuários da empresa
- `SUPERVISORS_AND_ADMINS` - Supervisores e admins
- `ALL_ADMINS_AND_SUPERVISORS` - Todos admins e supervisores
- `SPECIFIC_USERS` - Usuários específicos

## 🚀 Benefícios

1. **Código mais limpo** - Arquivos menores e focados
2. **Manutenção fácil** - Mudanças isoladas por entidade
3. **Escalabilidade** - Fácil adicionar novas entidades
4. **Reutilização** - Código compartilhado em `shared/`
5. **Compatibilidade** - API existente mantida
6. **Templates contextuais** - Notificações mais informativas
7. **Sistema de destinatários** - Controle fino de quem recebe
