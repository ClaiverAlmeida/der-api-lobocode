# Sistema de Tenant Simplificado

## Como Funciona

O sistema usa **1 interceptor** que resolve tudo automaticamente:

### Para Usuários Normais

- Usa automaticamente o `companyId` do usuário logado
- Não precisa fazer nada

### Para SYSTEM_ADMIN

- Pode especificar `companyId` no **body** (POST/PUT/PATCH) ou **query** (GET)
- Se não especificar, usa **tenant global** (acessa dados de todas as empresas)

## Uso

### 1. Aplicar o Interceptor

```typescript
@UseInterceptors(TenantInterceptor)
export class UsersController {
  // ...
}
```

### 2. Para SYSTEM_ADMIN especificar tenant

**POST/PUT/PATCH (no body):**

```typescript
// Body da requisição
{
  "name": "João",
  "email": "joao@empresa.com",
  "companyId": "empresa-123" // Apenas SYSTEM_ADMIN pode enviar
}
```

**GET (na query):**

```typescript
// URL: /users?companyId=empresa-123
```

### 3. Usar o TenantService

```typescript
@Injectable()
export class UsersService {
  constructor(private tenantService: TenantService) {}

  async getUsers() {
    const tenant = this.tenantService.getTenant();
    
    if (tenant.isGlobal) {
      // SYSTEM_ADMIN sem especificar companyId - retorna todos os usuários
      return this.prismaService.user.findMany();
    } else {
      // Usuário normal ou SYSTEM_ADMIN com companyId específico
      return this.prismaService.user.findMany({
        where: { companyId: tenant.id }
      });
    }
  }
}
```

## Segurança

- Apenas `SYSTEM_ADMIN` pode especificar `companyId`
- Outros usuários que tentarem enviar `companyId` terão a requisição bloqueada
- O sistema automaticamente filtra dados por tenant

## Comportamento do Tenant Global

Quando `SYSTEM_ADMIN` não especifica `companyId`:

- **GET /users**: Retorna usuários de **todas as empresas**
- **GET /users/:id**: Pode acessar usuário de **qualquer empresa**
- **PUT /users/:id**: Pode atualizar usuário de **qualquer empresa**
- **DELETE /users/:id**: Pode deletar usuário de **qualquer empresa**

Isso permite que o `SYSTEM_ADMIN` tenha visão global do sistema.

## Decorators (Opcionais)

```typescript
// Para extrair companyId do body
@Post()
create(@TenantBody() companyId: string) {
  // companyId do body (apenas SYSTEM_ADMIN)
}

// Para extrair companyId da query  
@Get()
findAll(@TenantQuery() companyId: string) {
  // companyId da query (apenas SYSTEM_ADMIN)
}
```
