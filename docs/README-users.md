# Users Module - Sistema de Roles Hierárquico

## 🏗️ **Arquitetura Aplicada**

Este módulo implementa um **sistema de roles hierárquico** para gestão de usuários em condomínios/empresas de segurança, seguindo os princípios **SOLID** com foco em **Single Responsibility (S)** e **Open/Closed (O)**:

### 🎯 **Escopo do Sistema de Usuários**

O sistema gerencia **7 tipos de usuários** com diferentes níveis de acesso:

1. **SYSTEM_ADMIN** - Administrador da plataforma (acesso global)
2. **ADMIN** - Administrador da empresa/condomínio
3. **SUPERVISOR** - Supervisor de segurança da empresa
4. **HR** - Recursos Humanos da empresa
5. **GUARD** - Vigilante de segurança (não associado a postos)
6. **POST_SUPERVISOR** - Supervisor de um posto específico (1 posto)
7. **POST_RESIDENT** - Morador/residente de um posto específico (1 posto)

### 🔗 **Associação com Postos**

- **GUARD, SUPERVISOR, HR, ADMIN**: Não são associados a postos específicos
- **POST_SUPERVISOR, POST_RESIDENT**: Associados a **exatamente 1 posto** cada

### **📁 Estrutura de Arquivos**

```
src/modules/users/
├── repositories/
│   └── user.repository.ts      # Abstração de dados
├── validators/
│   └── user.validator.ts       # Validações centralizadas
├── services/
│   └── user-query.service.ts   # Construção de queries
├── factories/
│   └── user.factory.ts         # Criação de usuários
├── dto/                        # Data Transfer Objects
├── users.service.ts            # Service principal (orquestrador)
├── users.controller.ts         # Controller
└── users.module.ts            # Module
```

## 🎯 **Princípios SOLID Aplicados**

### **S - Single Responsibility Principle**

Cada classe tem **uma única responsabilidade**:

- **`UserRepository`**: Operações de banco de dados
- **`UserValidator`**: Validações de negócio
- **`UserQueryService`**: Construção de queries e permissões
- **`UserFactory`**: Criação de objetos User
- **`UsersService`**: Orquestração dos serviços

### **O - Open/Closed Principle**

O sistema é **aberto para extensão, fechado para modificação**:

- ✅ **Novos tipos de usuário**: Adicione métodos no `UserFactory`
- ✅ **Novas validações**: Adicione métodos no `UserValidator`
- ✅ **Novos filtros**: Adicione métodos no `UserQueryService`
- ✅ **Novos repositórios**: Implemente interface comum

## 🔧 **Componentes**

### **1. UserRepository**

```typescript
// Responsabilidade: Abstração de dados
export class UserRepository {
  async findMany(where: Prisma.UserWhereInput, include?: Prisma.UserInclude)
  async findFirst(where: Prisma.UserWhereInput, include?: Prisma.UserInclude)
  async create(data: Prisma.UserCreateInput)
  async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput)
  async delete(where: Prisma.UserWhereUniqueInput)
}
```

### **2. UserValidator**

```typescript
// Responsabilidade: Validações de negócio
export class UserValidator {
  async validateEmailUnique(email: string, excludeUserId?: string)
  async validateCompanyExists(companyId: string)
  async validatePostBelongsToCompany(postId: string, companyId: string)
  async validateUserExists(id: string)
  async validateUserCanBeDeleted(id: string)
  async validateCPF(cpf: string, excludeUserId?: string)
  async validatePhone(phone: string, excludeUserId?: string)
}
```

### **3. UserQueryService**

```typescript
// Responsabilidade: Construção de queries e permissões
export class UserQueryService {
  buildWhereClause(baseWhere?: Prisma.UserWhereInput): Prisma.UserWhereInput
  buildWhereClauseForUpdate(id: string): Prisma.UserWhereInput
  canPerformAction(action: 'read' | 'update' | 'delete'): boolean
  canUpdateFields(user: any, updateData: any): boolean
}
```

### **4. UserFactory**

```typescript
// Responsabilidade: Criação de objetos User
export class UserFactory {
  createPlatformAdmin(dto: CreatePlatformAdminDto): Prisma.UserCreateInput
  createAdmin(dto: CreateAdminDto): Prisma.UserCreateInput
  createSupervisor(dto: CreateSupervisorDto): Prisma.UserCreateInput
  createGuard(dto: CreateGuardDto): Prisma.UserCreateInput
  createHR(dto: CreateHRDto): Prisma.UserCreateInput
  createPostSupervisor(dto: CreatePostSupervisorDto): Prisma.UserCreateInput
  createPostResident(dto: CreatePostResidentDto): Prisma.UserCreateInput
}
```

### **5. UsersService**

```typescript
// Responsabilidade: Orquestração dos serviços
export class UsersService {
  async getAll()           // Lista usuários com filtros
  async getById(id)        // Busca usuário específico
  async createXXX(dto)     // Cria usuários de diferentes tipos
  async update(id, dto)    // Atualiza usuário
  async remove(id)         // Remove usuário
  async findByXXX()        // Buscas específicas
}
```

## 🚀 **Vantagens da Nova Arquitetura**

### **✅ Eliminação de Código Duplicado**

- **Includes padrão** centralizados no Repository
- **Validações** reutilizáveis no Validator
- **Queries** padronizadas no QueryService

### **✅ Facilidade de Manutenção**

- **Mudanças isoladas** em cada componente
- **Testes unitários** mais simples
- **Debugging** mais fácil

### **✅ Extensibilidade**

- **Novos tipos de usuário** sem modificar código existente
- **Novas validações** sem afetar outros componentes
- **Novos filtros** sem alterar lógica de negócio

### **✅ Separação de Responsabilidades**

- **Repository**: Dados
- **Validator**: Regras de negócio
- **QueryService**: Permissões e filtros
- **Factory**: Criação de objetos
- **Service**: Orquestração

## 📋 **Exemplo de Uso**

```typescript
// Antes (código duplicado)
async getAll() {
  const ability = this.abilityService.ability;
  if (!ability.can('read', 'User')) {
    throw new ForbiddenError('You do not have permission to read users');
  }
  const tenant = this.tenantService.getTenant();
  const whereClause: any = {
    AND: [accessibleBy(ability, 'read').User],
  };
  if (!tenant.isGlobal) {
    whereClause.companyId = tenant.id;
  }
  return this.prismaService.user.findMany({
    where: whereClause,
    include: { /* includes duplicados */ }
  });
}

// Depois (código limpo)
async getAll() {
  if (!this.userQueryService.canPerformAction('read')) {
    throw new ForbiddenError('You do not have permission to read users');
  }
  const whereClause = this.userQueryService.buildWhereClause();
  return this.userRepository.findMany(whereClause);
}
```

## 🎯 **Padrão para Outros Módulos**

Este padrão pode ser replicado para outros módulos:

```
src/modules/[entity]/
├── repositories/
│   └── [entity].repository.ts
├── validators/
│   └── [entity].validator.ts
├── services/
│   └── [entity]-query.service.ts
├── factories/
│   └── [entity].factory.ts
├── [entity].service.ts
├── [entity].controller.ts
└── [entity].module.ts
```

## 🔄 **Próximos Passos**

1. **Aplicar o padrão** em outros módulos (Companies, Units, etc.)
2. **Criar interfaces** para os serviços (IUserRepository, etc.)
3. **Implementar testes unitários** para cada componente
4. **Adicionar logging** e métricas
5. **Criar documentação** de API automática
