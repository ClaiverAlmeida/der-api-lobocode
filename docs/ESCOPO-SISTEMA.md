# 🎯 Escopo do Sistema Departamento de Estradas de Rodagem Engine

## 📋 Visão Geral

O **Departamento de Estradas de Rodagem Engine** é um sistema backend robusto para gestão de segurança patrimonial, desenvolvido com NestJS 11. O sistema oferece controle de acesso multi-tenant com gestão de usuários baseada em roles hierárquicos.

---

## 🏢 **Multi-Tenancy**

### **Estrutura de Tenants**

- **Company**: Representa uma empresa ou condomínio
- **Isolamento Completo**: Cada tenant tem dados completamente isolados
- **Configuração Independente**: Cada tenant pode ter suas próprias configurações

### **Hierarquia de Dados**

```
Company (Tenant)
├── Posts (Postos de Segurança)
├── Users (Usuários)
└── Configurações
```

---

## 👥 **Sistema de Roles Hierárquico**

### **7 Tipos de Usuários**

| Role                | Descrição                           | Escopo  | Associação com Postos |
| ------------------- | ----------------------------------- | ------- | --------------------- |
| **SYSTEM_ADMIN**    | Administrador da plataforma         | Global  | ❌ Não associado      |
| **ADMIN**           | Administrador da empresa/condomínio | Company | ❌ Não associado      |
| **SUPERVISOR**      | Supervisor de segurança             | Company | ❌ Não associado      |
| **HR**              | Recursos Humanos                    | Company | ❌ Não associado      |
| **GUARD**           | Vigilante de segurança              | Company | ❌ Não associado      |
| **POST_SUPERVISOR** | Supervisor de posto específico      | Post    | ✅ **1 posto**        |
| **POST_RESIDENT**   | Morador/residente                   | Post    | ✅ **1 posto**        |

### **Hierarquia de Permissões**

```
SYSTEM_ADMIN (Máximo)
    ↓
ADMIN (Company)
    ↓
SUPERVISOR (Company)
    ↓
HR (Company)
    ↓
GUARD (Company)
    ↓
POST_SUPERVISOR (Post)
    ↓
POST_RESIDENT (Post) (Mínimo)
```

---

## 🏢 **Gestão de Postos**

### **Conceito de Posto**

- **Posto**: Ponto de acesso/segurança específico
- **Localização**: Cada posto tem uma localização física
- **Responsabilidade**: Cada posto tem responsáveis específicos

### **Associação com Usuários**

#### **Usuários NÃO Associados a Postos**

- **SYSTEM_ADMIN**: Acesso global à plataforma
- **ADMIN**: Acesso total à empresa/condomínio
- **SUPERVISOR**: Supervisão geral de segurança
- **HR**: Gestão de recursos humanos
- **GUARD**: Vigilante de segurança (pode ser alocado dinamicamente)

#### **Usuários Associados a 1 Posto**

- **POST_SUPERVISOR**: Supervisor de um posto específico
- **POST_RESIDENT**: Morador/residente de um posto específico

### **Validações de Associação**

- ✅ **POST_SUPERVISOR** e **POST_RESIDENT** devem ser associados a **exatamente 1 posto**
- ✅ O posto deve pertencer à mesma empresa do usuário
- ✅ Validação de unicidade: um usuário não pode ser associado a múltiplos postos

---

## 🔐 **Controle de Acesso**

### **Permissões por Role**

#### **SYSTEM_ADMIN**

- ✅ Acesso total à plataforma
- ✅ Gestão de todas as empresas
- ✅ Configurações globais
- ✅ Relatórios globais

#### **ADMIN**

- ✅ Gestão total da empresa
- ✅ Gestão de usuários da empresa
- ✅ Gestão de postos da empresa
- ✅ Relatórios da empresa

#### **SUPERVISOR**

- ✅ Visualizar usuários da empresa
- ✅ Gestão de guardas
- ✅ Relatórios de segurança
- ❌ Não pode criar/editar postos

#### **HR**

- ✅ Gestão de usuários da empresa
- ✅ Relatórios de RH
- ❌ Não pode acessar dados de segurança

#### **GUARD**

- ✅ Visualizar informações do posto (quando alocado)
- ✅ Registrar ocorrências
- ❌ Não pode gerenciar usuários

#### **POST_SUPERVISOR**

- ✅ Gestão do posto específico
- ✅ Visualizar dados do posto
- ✅ Relatórios do posto
- ❌ Não pode acessar outros postos

#### **POST_RESIDENT**

- ✅ Visualizar dados do próprio posto
- ✅ Registrar ocorrências do posto
- ❌ Não pode gerenciar nada

---

## 📊 **Auditoria e Rastreamento**

### **Campos de Auditoria**

Todos os registros incluem:

- **createdAt**: Data/hora de criação
- **updatedAt**: Data/hora da última atualização
- **deletedAt**: Data/hora de exclusão (soft delete)
- **createdBy**: Usuário que criou
- **updatedBy**: Usuário que atualizou

### **Logs de Ação**

- ✅ Criação de usuários
- ✅ Alterações de dados
- ✅ Exclusões (soft delete)
- ✅ Restaurações
- ✅ Logins/logouts
- ✅ Tentativas de acesso não autorizado

---

## 🏗️ **Arquitetura Técnica**

### **Módulos Principais**

```
src/modules/
├── users/           # Gestão de usuários (7 roles)
├── companies/       # Gestão de empresas/tenants
└── posts/          # Gestão de postos de segurança
```

### **Serviços Compartilhados**

```
src/shared/
├── auth/           # Autenticação e autorização
├── tenant/         # Sistema multi-tenant
├── prisma/         # Acesso ao banco de dados
├── validators/     # Validações customizadas
└── common/         # Utilitários comuns
```

### **Validações Implementadas**

- ✅ **Email único** por empresa
- ✅ **CPF único** por empresa
- ✅ **Telefone** válido (formato brasileiro)
- ✅ **Senha forte** (mínimo 8 caracteres, maiúscula, minúscula, número, símbolo)
- ✅ **CUID** válido para IDs
- ✅ **Role esperado** para cada endpoint
- ✅ **Posto pertence à empresa** do usuário

---

## 🚀 **Funcionalidades Implementadas**

### ✅ **Gestão de Usuários**

- CRUD completo para todos os 7 tipos de usuário
- Validações robustas
- Soft delete e restauração
- Paginação e filtros
- Auditoria completa

### ✅ **Multi-Tenancy**

- Isolamento completo de dados
- Middleware de tenant
- Validações de pertencimento

### ✅ **Segurança**

- Autenticação JWT
- Autorização baseada em roles
- Rate limiting
- Validações de entrada
- Headers de segurança

### ✅ **Infraestrutura**

- Docker e Docker Compose
- Health checks
- Logging estruturado
- Métricas e monitoramento
- Backup automático

---

## 📋 **Próximos Passos**

### **Fase 2: Funcionalidades Avançadas**

- [ ] Sistema de rondas
- [ ] Gestão de turnos
- [ ] Relatórios avançados
- [ ] Notificações em tempo real
- [ ] API mobile

### **Fase 3: Integrações**

- [ ] Integração com câmeras
- [ ] Integração com sensores
- [ ] Integração com sistemas de alarme
- [ ] API para terceiros

---

## 📚 **Documentação Relacionada**

- [README Principal](../README.md)
- [Módulo Users](./README-users.md)
- [Fase 1 - Fundação Sólida](./FASE-1-FUNDACAO-SOLIDA.md)
- [Desenvolvimento](./DESENVOLVIMENTO.md)
- [Produção](./PRODUCAO.md)
