# 🔔 Sistema de Notificações Global

Sistema de notificações global e simplificado para o ifraseg-engine. Fornece funcionalidades de notificação em tempo real para todas as entidades do sistema.

## 📋 Visão Geral

O sistema de notificações é composto por:

- **`NotificationService`**: Lógica principal de notificações
- **`NotificationHelper`**: Métodos simplificados por entidade
- **`NotificationMixin`**: Mixin para integração automática
- **`NotificationGateway`**: WebSocket para tempo real

## 🚀 Como Usar

### 1. **Importação Básica**

```typescript
import { NotificationHelper } from '../notifications/notification.helper';

@Injectable()
export class MeuService extends UniversalService<DtoCreate, DtoUpdate> {
  constructor(
    // ... outros parâmetros
    private notificationHelper: NotificationHelper,
  ) {
    super(/* ... */);
  }
}
```

### 2. **Notificações Automáticas nos Hooks**

```typescript
// Notificar criação
protected async depoisDeCriar(data: any, resultado: any): Promise<void> {
  await this.notificationHelper.entidadeCriada(
    'minhaEntidade',
    resultado.id,
    data.name || 'Entidade',
    data.userId,
    this.obterCompanyId(),
  );
}

// Notificar atualização
protected async depoisDeAtualizar(id: string, data: any, resultado: any): Promise<void> {
  await this.notificationHelper.entidadeAtualizada(
    'minhaEntidade',
    id,
    data.name || 'Entidade',
    this.obterUsuarioLogado().id,
    this.obterCompanyId(),
  );
}
```

### 3. **Notificações Específicas por Entidade**

#### **📋 Supplies (Suprimentos)**
```typescript
// Criação
await this.notificationHelper.supplyCriado(
  supplyId, 'Nome do Suprimento', userId, companyId
);

// Atualização
await this.notificationHelper.supplyAtualizado(
  supplyId, 'Nome do Suprimento', userId, companyId
);
```

#### **🕐 Shifts (Turnos)**
```typescript
// Início do turno
await this.notificationHelper.turnoIniciado(
  turnoId, 'Nome do Posto', userId, companyId
);

// Fim do turno
await this.notificationHelper.turnoFinalizado(
  turnoId, 'Nome do Posto', userId, companyId
);

// Turno em intervalo
await this.notificationHelper.turnoEmIntervalo(
  turnoId, 'Nome do Posto', userId, companyId
);
```

#### **🚨 Occurrences (Ocorrências)**
```typescript
// Criação
await this.notificationHelper.ocorrenciaCriada(
  ocorrenciaId, 'Título da Ocorrência', userId, companyId
);

// Atualização
await this.notificationHelper.ocorrenciaAtualizada(
  ocorrenciaId, 'Título da Ocorrência', userId, companyId
);
```

#### **🚗 Vehicle Checklists**
```typescript
// Criação
await this.notificationHelper.checklistVeiculoCriado(
  checklistId, 'Modelo do Veículo', userId, companyId
);

// Atualização
await this.notificationHelper.checklistVeiculoAtualizado(
  checklistId, 'Modelo do Veículo', userId, companyId
);
```

#### **👥 Users (Usuários)**
```typescript
// Criação
await this.notificationHelper.usuarioCriado(
  userId, 'Nome do Usuário', 'ADMIN', criadoPorUserId, companyId
);

// Atualização
await this.notificationHelper.usuarioAtualizado(
  userId, 'Nome do Usuário', criadoPorUserId, companyId
);

// Desativação
await this.notificationHelper.usuarioDesativado(
  userId, 'Nome do Usuário', criadoPorUserId, companyId
);
```

### 4. **Notificações Customizadas**

```typescript
// Notificação genérica
await this.notificationHelper.notificar(
  'Título da Notificação',
  'Mensagem da notificação',
  userId,
  companyId,
  'entityType',
  'entityId'
);

// Notificar usuários específicos
await this.notificationHelper.notificarUsuarios(
  ['userId1', 'userId2'],
  'Título',
  'Mensagem',
  'entityType',
  'entityId',
  criadoPorUserId,
  companyId
);
```

## 🔧 Exemplos Práticos

### **Exemplo 1: Supplies Service**

```typescript
@Injectable()
export class SuppliesService extends UniversalService<CreateSupplyDto, UpdateSupplyDto> {
  constructor(
    // ... outros parâmetros
    private notificationHelper: NotificationHelper,
  ) {
    super(/* ... */);
  }

  protected async depoisDeCriar(data: any, resultado: any): Promise<void> {
    await this.notificationHelper.supplyCriado(
      resultado.id,
      data.name || 'Suprimento',
      data.userId,
      this.obterCompanyId(),
    );
  }

  protected async depoisDeAtualizar(id: string, data: any, resultado: any): Promise<void> {
    await this.notificationHelper.supplyAtualizado(
      id,
      data.name || 'Suprimento',
      this.obterUsuarioLogado().id,
      this.obterCompanyId(),
    );
  }
}
```

### **Exemplo 2: Shifts Service**

```typescript
@Injectable()
export class ShiftsService extends UniversalService<CreateShiftDto, UpdateShiftDto> {
  constructor(
    // ... outros parâmetros
    private notificationHelper: NotificationHelper,
  ) {
    super(/* ... */);
  }

  async inicioDoTurno(data: CreateShiftDto) {
    const resultado = await super.criar(shiftData);
    
    // Notificar início do turno
    const postName = await this.obterNomeDoPosto(data.postId);
    await this.notificationHelper.turnoIniciado(
      resultado.id,
      postName,
      this.obterUsuarioLogado().id,
      this.obterCompanyId(),
    );

    return resultado;
  }

  async fimDoTurno(id: string, data: UpdateShiftDto) {
    const resultado = await super.atualizar(id, shiftData);
    
    // Notificar fim do turno
    const postName = await this.obterNomeDoPosto(resultado.postId);
    await this.notificationHelper.turnoFinalizado(
      id,
      postName,
      this.obterUsuarioLogado().id,
      this.obterCompanyId(),
    );

    return resultado;
  }
}
```

## 🌐 WebSocket (Tempo Real)

O sistema inclui WebSocket para notificações em tempo real:

```typescript
// Frontend (Angular)
import { io } from 'socket.io-client';

const socket = io('/notifications', {
  auth: {
    token: 'seu-jwt-token'
  }
});

// Escutar notificações
socket.on('new_notification', (notification) => {
  console.log('Nova notificação:', notification);
});

// Escutar contador de não lidas
socket.on('unread_count_updated', (data) => {
  console.log('Contador atualizado:', data.unreadCount);
});
```

## 📊 Endpoints REST

```typescript
// Buscar notificações do usuário
GET /notifications?page=1&limit=20&isRead=false&entityType=supply

// Contar não lidas
GET /notifications/unread-count

// Marcar como lida
PUT /notifications/:id/read

// Marcar todas como lidas
PUT /notifications/read-all
```

## 🎯 Benefícios

1. **Simplicidade**: Métodos específicos para cada entidade
2. **Automação**: Integração automática nos hooks do UniversalService
3. **Tempo Real**: WebSocket para notificações instantâneas
4. **Flexibilidade**: Notificações customizadas quando necessário
5. **Global**: Acessível em todos os módulos do sistema

## 🔒 Segurança

- Autenticação JWT obrigatória
- Validação de acesso por empresa
- Rate limiting implementado
- Logs de auditoria

## 📈 Monitoramento

- Métricas de notificações enviadas
- Logs estruturados
- Health checks
- Alertas de falhas
