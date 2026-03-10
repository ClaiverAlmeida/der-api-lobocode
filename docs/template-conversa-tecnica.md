# 📝 Template para Conversas Técnicas - DEPARTAMENTO ESTADUAL DE RODOVIAS Engine

## 🎯 **Início de Conversa (Sempre usar)**

```
Olá! Vou trabalhar no projeto DEPARTAMENTO ESTADUAL DE RODOVIAS Engine **seguindo as regras do projeto**:

📋 **Contexto**:
- Projeto: DEPARTAMENTO ESTADUAL DE RODOVIAS Engine (Sistema de Segurança Patrimonial)
- Stack: NestJS + TypeScript + Prisma + PostgreSQL
- Arquitetura: Multi-tenant, Sistema de Roles, Modular

🔗 **Regras Obrigatórias**:
- Arquivo: `.cursor/rules/nestjs-rules.mdc`
- Documentação: `docs/NAMING_CONVENTIONS.md`
- Contexto Completo: `projeto-context.md`

🎯 **Padrões Essenciais**:
- Métodos: `buscarUserPorId()`, `validarSeUserExiste()`, `criarNovoAdmin()`
- Entidades: `User`, `Company`, `Post`, `Role` (inglês)
- Propriedades: `id`, `name`, `email`, `companyId` (inglês)
- Arquitetura: Repository → Validator → Factory → Service → Controller
```

## 📋 **Checklist de Implementação**

### ✅ **Antes de Qualquer Código**

- [ ] Ler regras específicas no `.cursor/rules/nestjs-rules.mdc`
- [ ] Consultar `projeto-context.md` para contexto de negócio
- [ ] Verificar `docs/NAMING_CONVENTIONS.md` para nomenclatura
- [ ] Entender o padrão arquitetural específico

### ✅ **Durante Implementação**

- [ ] Métodos em português (`buscarTodos`, `validarSeUserExiste`)
- [ ] Entidades em inglês (`User`, `Company`, `Post`)
- [ ] Seguir padrão Repository → Validator → Factory → Service → Controller
- [ ] Usar sistema de mensagens centralizadas
- [ ] Implementar filtros de erro específicos
- [ ] Documentar com JSDoc
- [ ] Criar testes unitários

### ✅ **Validação Final**

- [ ] Código segue **todas** as regras estabelecidas
- [ ] Nomenclatura está correta
- [ ] Arquitetura SOLID aplicada
- [ ] Padrões do projeto respeitados
- [ ] Documentação atualizada

## 🚨 **Frases Obrigatórias**

### **Sempre mencionar:**

- "Seguindo as regras do projeto"
- "Conforme estabelecido no `.cursor/rules/nestjs-rules.mdc`"
- "Aplicando os padrões do DEPARTAMENTO ESTADUAL DE RODOVIAS Engine"

### **Exemplo:**

```
"Vou implementar esta funcionalidade **seguindo as regras do projeto**,
aplicando a arquitetura Repository → Validator → Factory → Service → Controller
e usando nomenclatura em português para métodos (`buscarTodos`, `validarSeUserExiste`)."
```

## 📚 **Referências Rápidas**

### **Roles (7 tipos)**

- `SYSTEM_ADMIN`, `ADMIN`, `SUPERVISOR`, `HR`, `GUARD`, `POST_SUPERVISOR`, `POST_RESIDENT`

### **Validações Customizadas**

- `@IsStrongPassword()`, `@IsUniqueEmail()`, `@IsUniqueCPF()`

### **Filtros de Erro**

- `TokenExpiredError`, `ValidationError`, `NotFoundError`

### **CRUD Genérico**

- `buscarTodos(page, limit)` - Lista com paginação
- `buscarPorId(id)` - Busca específica
- `criar(dto)` - Criação
- `atualizar(id, dto)` - Atualização
- `desativar(id)` - Soft delete

### **Sistema de Mensagens**

```typescript
VALIDATION_MESSAGES.REQUIRED.NAME;
ERROR_MESSAGES.RESOURCE.NOT_FOUND;
SUCCESS_MESSAGES.CRUD.CREATED;
```

## 🔧 **Comandos Úteis**

### **Desenvolvimento**

```bash
npm run start:dev
npx prisma studio
npm run test
```

### **Build**

```bash
npm run build
npm run format
npm run lint
```

## 📄 **Documentação Essencial**

### **Sempre consultar:**

1. `.cursor/rules/nestjs-rules.mdc` - Regras específicas
2. `docs/NAMING_CONVENTIONS.md` - Nomenclatura
3. `projeto-context.md` - Contexto completo
4. `cursor-helper.md` - Padrões essenciais

### **Documentação por módulo:**

- `src/shared/common/filters/README.md` - Sistema de filtros
- `src/shared/auth/README.md` - Autenticação
- `src/modules/users/README.md` - Usuários

## 🎯 **Regras de Negócio Específicas**

### **Turnos**

- 12 horas com tolerância de 5 minutos
- Sistema bloqueia fora do horário

### **Rondas**

- Horárias obrigatórias
- Checkpoints obrigatórios
- Geolocalização obrigatória

### **Botão de Pânico**

- Acesso para moradores
- Dados: nome, posto, GPS, horário
- Notificação para supervisores

### **Talão de Ocorrências**

- Numeração automática
- Reset diário às 00:00

---

**💡 Dica**: Este template garante que sempre siga as regras do projeto, mesmo sem contexto anterior!

## 🎯 **Frase de Contextualização Completa**

### **📋 Copie e cole sempre:**

```
Vou trabalhar no projeto DEPARTAMENTO ESTADUAL DE RODOVIAS Engine seguindo as regras do projeto estabelecidas em .cursor/rules/nestjs-rules.mdc. Leia cursor-helper.md para padrões essenciais, projeto-context.md para contexto completo e template-conversa-tecnica.md para estrutura. Aplique arquitetura Repository → Validator → Factory → Service → Controller, métodos em português (buscarTodos, validarSeUserExiste), entidades em inglês (User, Company, Post) e sistema de 7 roles hierárquicos.
```

---

**💡 Esta frase única contém:**

- ✅
