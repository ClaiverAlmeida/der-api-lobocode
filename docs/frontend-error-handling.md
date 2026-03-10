# Tratamento de Erros no Frontend

## Novos Códigos de Erro Padronizados

### Formato de Resposta de Erro

```typescript
interface ErrorResponse {
  error: string;
  message: string;
}
```

### Códigos de Erro Específicos

| Error Code | Mensagem | Ação Recomendada |
|------------|----------|------------------|
| `TOKEN_INVALID` | Token inválido | Logout e redirect para login |
| `TOKEN_EXPIRED` | Token expirado | Logout e redirect para login |
| `TOKEN_REQUIRED` | Token obrigatório | Redirect para login |
| `INVALID_CREDENTIALS` | Credenciais inválidas | Mostrar erro no formulário |
| `FORBIDDEN` | Acesso negado | Mostrar mensagem de acesso negado |
| `NOT_FOUND` | Não encontrado | Mostrar página 404 |
| `BAD_REQUEST` | Dados inválidos | Mostrar erros de validação |
| `CONFLICT` | Conflito | Mostrar mensagem específica |
| `RATE_LIMIT_EXCEEDED` | Limite excedido | Mostrar tempo de espera |

## Exemplos de Implementação

### Angular (HttpInterceptor)

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.errorCode) {
          this.handleError(error.error);
        }
        return throwError(error);
      })
    );
  }

  private handleError(errorResponse: ErrorResponse) {
    switch (errorResponse.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        this.notificationService.showError(errorResponse.message);
        this.authService.logout();
        this.router.navigate(['/login']);
        break;

      case 'TOKEN_REQUIRED':
        this.router.navigate(['/login']);
        break;

      case 'FORBIDDEN':
        this.notificationService.showError(errorResponse.message);
        this.router.navigate(['/dashboard']);
        break;

      case 'RATE_LIMIT_EXCEEDED':
        this.notificationService.showWarning(errorResponse.message);
        break;

      default:
        this.notificationService.showError(errorResponse.message);
    }
  }
}
```

### React (Axios Interceptor)

```typescript
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ErrorResponse {
  error: string;
  message: string;
}

// Configuração do interceptor
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.data?.error) {
      handleError(error.response.data);
    }
    return Promise.reject(error);
  }
);

function handleError(errorResponse: ErrorResponse) {
  switch (errorResponse.error) {
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
      toast.error(errorResponse.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      break;

    case 'TOKEN_REQUIRED':
      window.location.href = '/login';
      break;

    case 'FORBIDDEN':
      toast.error(errorResponse.message);
      window.location.href = '/dashboard';
      break;

    case 'RATE_LIMIT_EXCEEDED':
      toast.warning(errorResponse.message);
      break;

    case 'BAD_REQUEST':
      toast.error(errorResponse.message);
      break;

    default:
      toast.error(errorResponse.message);
  }
}
```

### Hook personalizado para React

```typescript
import { useState, useCallback } from 'react';

interface ErrorResponse {
  error: string;
  message: string;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorResponse | null>(null);

  const handleError = useCallback((errorResponse: ErrorResponse) => {
    setError(errorResponse);

    switch (errorResponse.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        // Lógica específica para token inválido
        break;

      case 'BAD_REQUEST':
        // Lógica específica para dados inválidos
        break;

      // ... outros casos
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
```

## Componente de Tratamento de Erros

### Angular

```typescript
// error-handler.component.ts
@Component({
  selector: 'app-error-handler',
  template: `
    <div *ngIf="error" class="error-container" [ngClass]="getErrorClass()">
      <i class="error-icon" [class]="getIconClass()"></i>
      <div class="error-content">
        <h3>{{ getErrorTitle() }}</h3>
        <p>{{ error.message }}</p>
        <button *ngIf="showRetryButton()" (click)="retry()">
          Tentar Novamente
        </button>
      </div>
    </div>
  `
})
export class ErrorHandlerComponent {
  @Input() error: ErrorResponse | null = null;
  @Output() retryAction = new EventEmitter<void>();

  getErrorClass(): string {
    switch (this.error?.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return 'error-auth';
      case 'FORBIDDEN':
        return 'error-permission';
      case 'NOT_FOUND':
        return 'error-not-found';
      default:
        return 'error-general';
    }
  }

  getIconClass(): string {
    switch (this.error?.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return 'fas fa-lock';
      case 'FORBIDDEN':
        return 'fas fa-ban';
      case 'NOT_FOUND':
        return 'fas fa-search';
      default:
        return 'fas fa-exclamation-triangle';
    }
  }

  getErrorTitle(): string {
    switch (this.error?.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return 'Sessão Expirada';
      case 'FORBIDDEN':
        return 'Acesso Negado';
      case 'NOT_FOUND':
        return 'Não Encontrado';
      default:
        return 'Erro';
    }
  }

  showRetryButton(): boolean {
    return !['TOKEN_INVALID', 'TOKEN_EXPIRED', 'FORBIDDEN'].includes(
      this.error?.error || ''
    );
  }

  retry(): void {
    this.retryAction.emit();
  }
}
```

### React

```typescript
// ErrorHandler.tsx
interface ErrorHandlerProps {
  error: ErrorResponse | null;
  onRetry?: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onRetry }) => {
  if (!error) return null;

  const getErrorClass = () => {
    switch (error.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return 'error-auth';
      case 'FORBIDDEN':
        return 'error-permission';
      case 'NOT_FOUND':
        return 'error-not-found';
      default:
        return 'error-general';
    }
  };

  const getIcon = () => {
    switch (error.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return '🔒';
      case 'FORBIDDEN':
        return '🚫';
      case 'NOT_FOUND':
        return '🔍';
      default:
        return '⚠️';
    }
  };

  const getTitle = () => {
    switch (error.error) {
      case 'TOKEN_INVALID':
      case 'TOKEN_EXPIRED':
        return 'Sessão Expirada';
      case 'FORBIDDEN':
        return 'Acesso Negado';
      case 'NOT_FOUND':
        return 'Não Encontrado';
      default:
        return 'Erro';
    }
  };

  const showRetryButton = () => {
    return !['TOKEN_INVALID', 'TOKEN_EXPIRED', 'FORBIDDEN'].includes(error.error);
  };

  return (
    <div className={`error-container ${getErrorClass()}`}>
      <span className="error-icon">{getIcon()}</span>
      <div className="error-content">
        <h3>{getTitle()}</h3>
        <p>{error.message}</p>
        {showRetryButton() && onRetry && (
          <button onClick={onRetry}>Tentar Novamente</button>
        )}
      </div>
    </div>
  );
};

export default ErrorHandler;
```

## Validação de Formulários

### Tratamento de Erros de Validação

```typescript
// Para erros de validação (BAD_REQUEST)
function handleValidationErrors(errorResponse: ErrorResponse) {
  if (errorResponse.error === 'BAD_REQUEST') {
    // Mostrar mensagem de erro genérica
    showError(errorResponse.message);
  }
}
```

## Benefícios da Padronização

### Para o Frontend:
- **Tratamento consistente** de erros
- **Mensagens amigáveis** para o usuário
- **Códigos específicos** para lógica condicional
- **Redução de código** repetitivo
- **Melhor experiência** do usuário

### Para o Backend:
- **Logs detalhados** para debug
- **Segurança** (stack traces não expostos)
- **Padronização** de respostas
- **Facilidade** de manutenção

## Exemplo de Uso Completo

```typescript
// Serviço de autenticação
class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error === 'INVALID_CREDENTIALS') {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

// Componente de login
const LoginComponent = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      await authService.login(credentials);
      // Redirect para dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      {/* campos do formulário */}
    </form>
  );
};
```

Esta padronização melhora significativamente a experiência do usuário e facilita a manutenção do código frontend. 