# 🏢 Contexto Completo do Projeto - DEPARTAMENTO ESTADUAL DE RODOVIAS Engine

## 📋 Informações Essenciais

### 🎯 **Domínio do Negócio**

- **Produto**: Sistema de gestão de segurança patrimonial
- **Clientes**: Condomínios e empresas de segurança
- **Modelo**: SaaS multi-tenant (cada empresa = 1 tenant)
- **Foco**: Controle de acesso, rondas, ocorrências, gestão de pessoal

### 🏗️ **Arquitetura Técnica**

- **Backend**: NestJS 11 + TypeScript + Prisma + PostgreSQL
- **Padrão**: Repository → Validator → Factory → Service → Controller
- **Auth**: JWT + refresh tokens + CASL para autorização
- **Filters**: Sistema hierárquico de tratamento de erros
- **Deploy**: Docker + Docker Compose

## 🚀 **Configuração Rápida**

### **Variáveis de Ambiente Obrigatórias**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:15432/departamento-estadual-rodovias"

# Auth
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development
```

### **Comandos Essenciais**

```bash
# Instalação
npm install

# Desenvolvimento
npm run start:dev

# Banco de dados
npx prisma migrate dev
npx prisma generate
npx prisma studio

# Testes
npm run test
npm run test:e2e
```

## 👥 **Sistema de Roles (7 tipos)**

### **Hierarquia de Permissões**

```
SYSTEM_ADMIN (global)
    ↓
ADMIN (empresa)
    ↓
SUPERVISOR (empresa)
    ↓
HR (empresa)
    ↓
GUARD (empresa)
    ↓
POST_SUPERVISOR (1 posto)
    ↓
POST_RESIDENT (1 posto)
```

### **Regras de Associação**

- **SYSTEM_ADMIN**: Acesso global, sem empresa
- **ADMIN, SUPERVISOR, HR, GUARD**: Associados a 1 empresa
- **POST_SUPERVISOR, POST_RESIDENT**: Associados a 1 empresa + 1 posto

## 🎯 **Regras de Negócio Específicas**

### **Turnos de Trabalho**

- **Duração**: 12 horas
- **Tolerância**: 5 minutos para início/fim
- **Bloqueio**: Sistema bloqueia fora do horário de turno
- **Troca**: Apenas supervisor pode autorizar troca de posto

### **Rondas de Segurança**

- **Frequência**: Horárias (obrigatórias)
- **Checkpoints**: Pontos obrigatórios por posto
- **Geolocalização**: Validação de presença via GPS
- **Notificações**: Push para rondas não realizadas
- **Cancelamento**: Apenas supervisor pode cancelar (com justificativa)

### **Sistema de Ocorrências**

- **Talão**: Numeração automática, reset diário às 00:00
- **Categorização**: Tipos de ocorrência pré-definidos
- **Despacho**: Workflow de encaminhamento
- **Anexos**: Fotos, vídeos, documentos
- **Notificações**: Pop-up automático no APP/WEB

### **Botão de Pânico**

- **Acesso**: Moradores via web app
- **Dados**: Nome, posto, GPS, horário
- **Notificação**: Alerta automático para supervisores
- **Integração**: Opcional com 190 (polícia)

## 🛠️ **Exemplos Práticos**

### **Criar Novo Módulo (Seguindo Padrões)**

```typescript
// 1. Estrutura de pastas
src/modules/rounds/
├── dto/
├── entities/
├── services/
├── repositories/
├── validators/
├── factories/
├── controllers/
└── rounds.module.ts

// 2. Repository (acesso a dados)
@Injectable()
export class PatrolRepository {
  async buscarMuitos(where: Prisma.PatrolWhereInput) { }
  async buscarPrimeiro(where: Prisma.PatrolWhereInput) { }
  async criar(data: Prisma.PatrolCreateInput) { }
  async atualizar(where: Prisma.PatrolWhereUniqueInput, data: Prisma.PatrolUpdateInput) { }
}

// 3. Validator (validações de negócio)
@Injectable()
export class PatrolValidator {
  async validarSePatrolExiste(id: string) { }
  async validarSePostPertenceACompany(postId: string, companyId: string) { }
  async validarSeHorarioEhValido(horario: Date) { }
}

// 4. Service (lógica de negócio)
@Injectable()
export class PatrolService {
  async buscarTodos(page = 1, limit = 20) { }
  async buscarPorId(id: string) { }
  async criar(dto: CreatePatrolDto) { }
  async atualizar(id: string, dto: UpdatePatrolDto) { }
  async desativar(id: string) { }
  async iniciarRonda(guardId: string, postId: string) { }
  async finalizarRonda(roundId: string) { }
}

// 5. Controller (endpoints)
@Controller('rounds')
@UseGuards(AuthGuard, RoleGuard)
export class PatrolController {
  @Get()
  @RequiredRoles(Roles.ADMIN, Roles.SUPERVISOR)
  buscarTodos(@Query('page') page: string, @Query('limit') limit: string) {
    return this.roundService.buscarTodos(+page, +limit);
  }
}
```

### **Implementar Validação Customizada**

```typescript
// 1. Criar decorator
@ValidatorConstraint({ name: 'isValidShiftTime', async: false })
export class IsValidShiftTimeConstraint implements ValidatorConstraintInterface {
  validate(time: string) {
    // Validar formato HH:MM
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  defaultMessage() {
    return 'Horário deve estar no formato HH:MM';
  }
}

export function IsValidShiftTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidShiftTimeConstraint,
    });
  };
}

// 2. Usar no DTO
export class CreateShiftDto {
  @IsValidShiftTime()
  startTime: string;

  @IsValidShiftTime()
  endTime: string;
}
```

### **Criar Filtro Específico**

```typescript
@Catch(PatrolNotFoundError)
export class PatrolNotFoundErrorFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: PatrolNotFoundError, host: ArgumentsHost) {
    this.sendErrorResponse(
      exception,
      host,
      HttpStatus.NOT_FOUND,
      'ROUND_NOT_FOUND',
      'Ronda não encontrada',
    );
  }
}
```

## 🗂️ **Dados de Exemplo**

### **Usuários Padrão por Role**

```typescript
// SYSTEM_ADMIN
{
  name: "Admin Sistema",
  email: "admin@departamento-estadual-rodovias.com",
  role: "SYSTEM_ADMIN",
  companyId: null // Global
}

// ADMIN
{
  name: "João Silva",
  email: "admin@condominio.com",
  role: "ADMIN",
  companyId: "comp_123"
}

// GUARD
{
  name: "Carlos Santos",
  email: "guard@condominio.com",
  role: "GUARD",
  companyId: "comp_123"
}

// POST_SUPERVISOR
{
  name: "Maria Oliveira",
  email: "supervisor@condominio.com",
  role: "POST_SUPERVISOR",
  companyId: "comp_123",
  postId: "post_456"
}
```

### **Empresas de Exemplo**

```typescript
{
  name: "Condomínio Residencial Jardins",
  type: "CONDOMINIO",
  cnpj: "12.345.678/0001-90",
  address: "Rua das Flores, 123",
  city: "São Paulo",
  state: "SP"
}
```

### **Postos de Exemplo**

```typescript
{
  name: "Portaria Principal",
  description: "Entrada principal do condomínio",
  location: "Térreo - Bloco A",
  companyId: "comp_123",
  isActive: true
}
```

## 🔧 **Troubleshooting Comum**

### **Erro: "secretOrPrivateKey must have a value"**

```bash
# Verificar se JWT_SECRET está definido
echo $JWT_SECRET

# Adicionar no .env
JWT_SECRET="your-secret-key-here"
```

### **Erro: "Cannot connect to database"**

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Subir banco local
docker-compose up -d db
```

### **Erro: "Role not found"**

```bash
# Verificar se roles existem no banco
npx prisma studio

# Executar seed se necessário
npx prisma db seed
```

## 📚 **Referências Rápidas**

### **Porta Padrão**

- **API**: 3000
- **Database**: 5432
- **Redis**: 6379

### **Endpoints Principais**

- **Auth**: `/auth/login`, `/auth/refresh`
- **Users**: `/users`, `/users/:id`
- **Health**: `/health`

### **Comandos de Desenvolvimento**

```bash
# Logs
npm run start:dev | grep ERROR

# Build
npm run build

# Formato
npm run format

# Lint
npm run lint
```

---

**💡 Resumo**: Este arquivo complementa as regras do projeto com contexto de negócio, configurações práticas e exemplos de uso, garantindo entendimento completo mesmo sem contexto anterior.
