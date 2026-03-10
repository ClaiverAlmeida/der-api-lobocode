# AuthGuard com Exceções Customizadas

## 🎯 Implementação Robusta

```typescript
import { TokenExpiredError, TokenInvalidError, TokenRequiredError } from '../common/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  // ... outros métodos ...

  // Validar se token existe
  private validateTokenExists(token: string | undefined): void {
    if (!token) {
      throw new TokenRequiredError(); // Exceção específica
    }
  }

  // Validar e decodificar token JWT
  private validateAndDecodeToken(token: string): ITokenPayload {
    try {
      return this.jwtService.verify<ITokenPayload>(token, {
        algorithms: ['HS256'],
      });
    } catch (error: any) {
      // Tratar diferentes tipos de erro JWT de forma específica
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredError(); // Exceção específica
      }
      
      if (error.name === 'JsonWebTokenError') {
        throw new TokenInvalidError(); // Exceção específica
      }
      
      if (error.name === 'NotBeforeError') {
        throw new TokenInvalidError(); // Exceção específica
      }
      
      // Para outros erros JWT
      throw new TokenInvalidError(); // Exceção específica
    }
  }

  // Tratar erros de autenticação
  private handleAuthenticationError(error: any): never {
    // Se já é uma exceção customizada, apenas re-throw
    if (error instanceof TokenExpiredError || 
        error instanceof TokenInvalidError || 
        error instanceof TokenRequiredError) {
      throw error;
    }

    // Para outros erros, converter para exceção específica
    throw new TokenInvalidError();
  }
}
```

## 🚀 Vantagens das Exceções Customizadas

### ✅ **Type Safety**
- Cada tipo de erro tem sua própria classe
- Melhor detecção de erros em tempo de compilação

### ✅ **Modularidade**
- Cada exceção tem seu próprio filtro
- Fácil de adicionar novos tipos de erro

### ✅ **Robustez**
- Não depende de comparação de strings
- Menos propenso a erros

### ✅ **Testabilidade**
- Cada exceção pode ser testada individualmente
- Mocks mais precisos

## 📋 Comparação das Abordagens

| Aspecto | Detecção Automática | Exceções Customizadas |
|---------|-------------------|----------------------|
| **Complexidade** | Baixa | Média |
| **Robustez** | Média | Alta |
| **Manutenibilidade** | Boa | Excelente |
| **Type Safety** | Não | Sim |
| **Performance** | Boa | Excelente |
| **Testabilidade** | Boa | Excelente |

## 🎯 Recomendação

Para sistemas **pequenos e rápidos**: Use **Detecção Automática** (já implementada)
Para sistemas **robustos e escaláveis**: Use **Exceções Customizadas** 