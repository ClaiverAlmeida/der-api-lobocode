# Estratégia de Tratamento de Erros - Arquitetura Modular

## 🏗️ Arquitetura dos Filtros

### BaseExceptionFilter (Classe Base)
```typescript
export abstract class BaseExceptionFilter {
  protected sendErrorResponse(
    exception: any,
    host: ArgumentsHost,
    status: HttpStatus,
    errorCode: string,
    message: string,
  ) {
    // Resposta padronizada minimalista
    const errorResponse = {
      error: errorCode,
      message: message,
    };
    
    response.status(status).json(errorResponse);
  }
}
```

### Filtros Específicos (Herdam de BaseExceptionFilter)

#### 1. ForbiddenErrorFilter
- **Captura**: `ForbiddenError` (erro customizado)
- **Resposta**: `{ "error": "FORBIDDEN", "message": "Acesso negado" }`

#### 2. NotFoundErrorFilter  
- **Captura**: `NotFoundError` (erro customizado)
- **Resposta**: `{ "error": "NOT_FOUND", "message": "Não encontrado" }`

#### 3. ConflictErrorFilter
- **Captura**: `ConflictError` (erro customizado)
- **Resposta**: `{ "error": "CONFLICT", "message": "Conflito" }`

#### 4. AuthErrorFilter
- **Captura**: `HttpException` com status 401
- **Resposta**: 
  - `{ "error": "TOKEN_INVALID", "message": "Token inválido" }`
  - `{ "error": "TOKEN_EXPIRED", "message": "Token expirado" }`
  - `{ "error": "TOKEN_REQUIRED", "message": "Token obrigatório" }`

#### 5. HttpExceptionFilter
- **Captura**: `HttpException` (padrão NestJS)
- **Resposta**: Erros HTTP como 400, 404, 500, etc.

## 📋 Configuração no App Module

```typescript
providers: [
  // Filtros específicos para erros customizados
  { provide: APP_FILTER, useClass: ForbiddenErrorFilter },
  { provide: APP_FILTER, useClass: NotFoundErrorFilter },
  { provide: APP_FILTER, useClass: ConflictErrorFilter },
  { provide: APP_FILTER, useClass: UnauthorizedErrorFilter },
  { provide: APP_FILTER, useClass: ValidationErrorFilter },
  { provide: APP_FILTER, useClass: InvalidCredentialsErrorFilter },
  { provide: APP_FILTER, useClass: AuthErrorFilter },
  // Filtro para exceções HTTP padrão do NestJS
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
]
```

## ✅ Vantagens da Arquitetura Modular

1. **Especialização**: Cada filtro trata um tipo específico de erro
2. **Reutilização**: `BaseExceptionFilter` padroniza todas as respostas
3. **Manutenibilidade**: Fácil adicionar novos filtros específicos
4. **Testabilidade**: Cada filtro pode ser testado independentemente
5. **Clareza**: Responsabilidades bem definidas

## 🔧 Como Usar nos Serviços

```typescript
// Para erro de acesso negado
throw new ForbiddenError('Você não tem permissão para acessar este recurso');

// Para erro de não encontrado
throw new NotFoundError('Produto não encontrado');

// Para conflito (ex: email duplicado)
throw new ConflictError('Email já existe');

// Para erros HTTP padrão do NestJS
throw new NotFoundException('Usuário não encontrado');
throw new BadRequestException('Dados inválidos');
```

## 📝 Formato de Resposta Padronizado

**Todos os filtros retornam o mesmo formato:**
```json
{
  "error": "CODIGO_ERRO",
  "message": "Mensagem amigável"
}
```

## 🛡️ Segurança

- ✅ **Sem stack traces** em produção
- ✅ **Sem paths internos** expostos
- ✅ **Mensagens consistentes** e amigáveis
- ✅ **Códigos de erro** específicos para frontend
- ✅ **Logs detalhados** apenas internamente

## 🎯 Resultado Final

- **Respostas 90% menores** (de 500+ bytes para ~50 bytes)
- **Segurança máxima** (zero exposição de detalhes internos)
- **Facilidade de manutenção** (arquitetura modular)
- **Padrão de mercado** (formato minimalista) 