# Por onde começar: migração do backend para Departamento Estadual Rodovias

Sugestão de ordem para não quebrar tudo de uma vez e ter um primeiro fluxo funcionando (front ↔ API).

---

## Decisão inicial: banco de dados

- **Opção A (recomendada):** Usar um **banco novo** só para Departamento Estadual Rodovias (ex.: `departamento_estadual_rodovias_dev`). Você mantém o schema atual em outro banco se precisar, e este projeto passa a apontar só para o banco Departamento Estadual Rodovias.
- **Opção B:** Substituir o banco atual. Só use se não precisar mais dos dados/estrutura Departamento Estadual Rodovias neste projeto.

Seguindo **Opção A**: crie um banco PostgreSQL (ex.: `departamento_estadual_rodovias_dev`), configure `DATABASE_URL` no `.env` para esse banco e use só o schema Departamento Estadual Rodovias daqui pra frente.

---

## Passo 1 – Ativar o schema Departamento Estadual Rodovias

1. **Backup do schema atual** (para referência ou rollback):
   ```bash
   cp prisma/schema.prisma prisma/schema.departamento-estadual-rodovias.backup.prisma
   ```
2. **Substituir o schema ativo** pelo Departamento Estadual Rodovias:
   ```bash
   cp prisma/schema.departamento-estadual-rodovias.prisma prisma/schema.prisma
   ```
3. **Gerar o cliente Prisma** (vai dar erro de migração até rodar migrate):
   ```bash
   npx prisma generate
   ```
4. **Criar a primeira migração** no banco Departamento Estadual Rodovias:
   ```bash
   npx prisma migrate dev --name init_departamento_estadual_rodovias
   ```
5. A partir daqui o backend atual **vai quebrar** (tabelas de Users, Companies, etc. são outras). Por isso: fazer isso em uma branch e seguir direto para o Passo 2 e 3.

---

## Passo 2 – Ajustar Auth e seed para o novo modelo

- O **Auth** atual (login/refresh/logout) pode ser mantido; o que muda é o **modelo User** e o **enum Roles**.
- No schema Departamento Estadual Rodovias, `User` tem `role: Roles` com `ADMIN | COMERCIAL | LOGISTICS | DRIVER`.
- Ajustes necessários:
  1. **Auth (JWT payload):** Garantir que o payload use os novos roles (ex.: `ADMIN`, `COMERCIAL`, `LOGISTICS`, `DRIVER`) em vez dos antigos (SYSTEM_ADMIN, GUARD, etc.). Isso pode exigir alterar o serviço de login e o que lê do Prisma (buscar usuário pelo novo `User`).
  2. **Seed:** Criar ao menos uma **Company** e um **User** (ex.: admin) com role `ADMIN` e senha conhecida, para testar login no front.
- **Ordem sugerida:** Fazer o Passo 1, depois adaptar o auth (e o que depender de `User`/`Company` do Prisma) para o novo schema e, por fim, rodar o seed.

---

## Passo 3 – Primeiro módulo: Clientes

- É a base para Agendamentos, Transações e parte do Motorista; o front já tem tela e tipos prontos.
- Criar no backend:
  1. **Módulo** `src/modules/clientes/` (ou `clients/` se quiser nome em inglês no código; no doc de análise usamos “clientes” na URL).
  2. **Controller:** `GET /clientes`, `POST /clientes`, `GET /clientes/:id`, `PATCH /clientes/:id`, `DELETE /clientes/:id` (e opcionalmente listar com filtros por status, atendente, etc.).
  3. **Service + repositório (ou só service):** Criar/atualizar/buscar `Cliente` no Prisma, sempre filtrando por `companyId` (multi-tenant).
  4. **DTOs:** Alinhados ao tipo `Cliente` do front (`enderecoUSA` e `destinoBrasil` como objetos; no Prisma estão como `Json`).
  5. **Guards:** Proteger rotas com auth e, se fizer sentido, restringir por role (ex.: COMERCIAL e ADMIN podem alterar clientes).

Depois que Clientes estiver estável, o front pode trocar o DataContext de clientes para usar `GET/POST/PATCH/DELETE /clientes`.

---

## Ordem resumida (checklist)

| #   | O que fazer                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Backup do `schema.prisma` atual → `schema.departamento-estadual-rodovias.backup.prisma`                           |
| 2   | Substituir `schema.prisma` pelo conteúdo de `schema.departamento-estadual-rodovias.prisma`                        |
| 3   | Configurar `DATABASE_URL` para o banco Departamento Estadual Rodovias (ex.: `departamento_estadual_rodovias_dev`) |
| 4   | `npx prisma generate` e `npx prisma migrate dev --name init_departamento_estadual_rodovias`                       |
| 5   | Ajustar Auth (e dependentes) para o novo `User` e `Roles`; ajustar seed (Company + User ADMIN)                    |
| 6   | Criar módulo **Clientes** (controller, service, DTOs, guard) e testar no front                                    |

Recomendação: **começar pelo Passo 1 (ativar o schema Departamento Estadual Rodovias e migrar o banco)**. Em seguida Passo 2 (auth + seed) e depois Passo 3 (módulo Clientes). Se quiser, na próxima mensagem podemos detalhar só o Passo 1 (comandos e nomes de arquivos exatos) ou ir direto para o código do Passo 2 e 3.
