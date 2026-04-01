# Análise completa: Front Departamento Estadual Rodovias (referência) x Backend e Schema

**Objetivo:** Alinhar o backend (departamento-estadual-rodovias-api-lobocode) ao front (departamento-estadual-rodoviasmanagementsystem), usando o `schema.departamento-estadual-rodovias.prisma` como base e ajustando conforme a necessidade real de cada componente do front.

---

## 1. Visão geral

| Aspecto            | Front (departamento-estadual-rodoviasmanagementsystem)                                                                                                                                     | Backend atual (departamento-estadual-rodovias-api-lobocode)                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domínio**        | Mudanças internacionais EUA–Brasil (clientes, agendamentos, containers, estoque, financeiro, RH, motorista, leads)                                                                         | Segurança patrimonial (Departamento Estadual Rodovias): turnos, postos, rondas, checkpoints, ocorrências, veículos, panic events, reports (checklists, férias, rescisões, etc.) |
| **Fonte de dados** | `DataContext` com dados **mock** em memória                                                                                                                                                | Prisma com `schema.prisma` (Departamento Estadual Rodovias)                                                                                                                     |
| **Auth**           | Integrado com API (login/refresh/logout); roles: admin, comercial, logistico, motorista                                                                                                    | Auth JWT com roles Departamento Estadual Rodovias (SYSTEM_ADMIN, ADMIN, HR, GUARD, etc.)                                                                                        |
| **Conclusão**      | Front é a **referência** de negócio. Backend atual **não atende** ao front; é necessário **adaptar** o backend ao domínio Departamento Estadual Rodovias e expor APIs que o front consuma. |

---

## 2. Módulos do front e necessidades de API

Cada tela do front usa o `DataContext`, que hoje mantém estado em memória. Para integrar com o backend, cada entidade precisa de **endpoints REST** (CRUD + listagens filtradas) e o front deve trocar o uso do `useData()` por chamadas ao `api` (api.service).

### 2.1 Dashboard

- **Dados:** `clientes`, `estoque`, `agendamentos`, `containers`, `transacoes`
- **Uso:** KPIs (agendamentos hoje/amanhã, receita/despesa, lucro, estoque baixo, containers ativos), gráficos, atividades recentes, alertas
- **API necessária:** Endpoints que retornem listas/agregados (ou um endpoint “dashboard” que devolva resumo).

### 2.2 Clientes (`clientes.tsx`)

- **Entidade:** `Cliente` (tipos em `src/app/types/index.ts`)
- **Campos:** id, nome, cpf, telefoneUSA, enderecoUSA (rua, numero, cidade, estado, zipCode, complemento), destinoBrasil (nomeRecebedor, cpfRecebedor, endereco, cidade, estado, cep, telefones), atendente, dataCadastro, status (ativo | inativo)
- **Operações:** listar, filtrar, criar, editar, excluir
- **API:** `GET/POST /clientes`, `GET/PATCH/DELETE /clientes/:id`, filtros por status/atendente/periodo

### 2.3 Estoque (`estoque.tsx`)

- **Entidade:** `Estoque` (por empresa: caixasPequenas, caixasMedias, caixasGrandes, fitasAdesivas)
- **Observação:** No front, em alguns pontos aparece `estoque.fitas`; no tipo está `fitasAdesivas`. Unificar para `fitasAdesivas` no front ou manter o mesmo nome do schema.
- **Operações:** ler, atualizar quantidades; front também tem “movimentações” (entrada/saída) em estado local – pode virar entidade no backend depois
- **API:** `GET /estoque` (por company), `PATCH /estoque` (atualizar quantidades)

### 2.4 Agendamentos (`agendamentos.tsx`)

- **Entidade:** `Agendamento`: id, clienteId, clienteNome, dataColeta, horaColeta, endereco, status (pendente | confirmado | coletado | cancelado), observacoes, atendente
- **Operações:** listar (calendário/lista/timeline), criar, editar, excluir
- **API:** `GET/POST /agendamentos`, `GET/PATCH/DELETE /agendamentos/:id`, filtros por data/status/atendente

### 2.5 Containers (`containers.tsx`)

- **Entidade:** `Container`: id, numero, tipo (20ft | 40ft | 40ft HC | 45ft HC), origem, destino, dataEnvio, dataEmbarque, previsaoChegada, status, volume, linkRastreamento, caixas[], pesoTotal, limiteP
- **ContainerCaixa:** clienteId, clienteNome, numeroCaixa, tamanho, peso
- **Operações:** CRUD, filtros por status/origem/destino
- **API:** `GET/POST /containers`, `GET/PATCH/DELETE /containers/:id`, sub-recurso ou inclusão de caixas no payload

### 2.6 Financeiro (`financeiro.tsx`)

- **Entidade:** `Transacao`: id, clienteId, clienteNome, tipo (receita | despesa), categoria, valor, data, descricao, metodoPagamento
- **Operações:** listar (todas/receitas/despesas), criar, excluir, filtros por período/categoria
- **API:** `GET/POST /transacoes`, `GET/DELETE /transacoes/:id`, query params (tipo, dataInicio, dataFim, categoria)

### 2.7 Relatórios (`relatorios.tsx`)

- **Dados:** clientes, transacoes, agendamentos, containers, estoque
- **Uso:** relatórios visão geral, clientes, financeiro, operacional, atendimento (gráficos e tabelas)
- **API:** pode ser apenas os mesmos endpoints de listagem com filtros de data; ou endpoints específicos de relatório (ex.: `GET /relatorios/visao-geral?inicio=&fim=`)

### 2.8 Atendimentos (`atendimentos.tsx`)

- **Entidade:** Lead (pipe de vendas): id, nome, telefone, email, origem, destino, ultimaMensagem, dataUltimaMensagem, status (novo | qualificando | orcamento | negociando | fechado | perdido), atendidoPorBot, valorEstimado, dataMudanca, tags, notas, prioridade (alta | media | baixa), conversas[]
- **LeadConversa:** id, leadId, texto, remetente (cliente | bot | atendente), data
- **Operações:** kanban por status, criar/editar lead, adicionar conversa
- **API:** `GET/POST /leads`, `GET/PATCH/DELETE /leads/:id`, `GET/POST /leads/:id/conversas`

### 2.9 Preços (`precos.tsx`)

- **PrecoEntrega:** cidadeOrigem, estadoOrigem, cidadeDestino, estadoDestino, precoPorKg, precoMinimo, prazoEntrega, ativo
- **PrecoProduto:** tipo (caixa | fita), nome, tamanho, dimensoes, pesoMaximo, unidade, precoCusto, precoVenda, estoque, estoqueMinimo, ativo
- **Operações:** CRUD para ambos
- **API:** `GET/POST/PATCH/DELETE /precos-entrega`, `GET/POST/PATCH/DELETE /precos-produtos`

### 2.10 RH (`rh.tsx`)

- **Funcionario:** id, nome, email, telefone, cpf, dataNascimento, dataAdmissao, dataDemissao, cargo, departamento, salario, tipoContrato (CLT | PJ | Temporário | Estágio), status (ativo | férias | afastado | demitido), endereco (objeto), documentos, beneficios[], supervisor, foto
- **RegistroPonto:** funcionarioId, funcionarioNome, data, entrada, saidaAlmoco, voltaAlmoco, saida, horasTrabalhadas, horasExtras, tipo (normal | falta | atestado | folga), observacoes
- **Folha:** funcionarioId, funcionarioNome, mesReferencia, salarioBase, horasExtras, bonificacoes, descontos, inss, fgts, salarioLiquido, dataPagamento, status (pendente | pago | atrasado)
- **Ferias:** funcionarioId, funcionarioNome, periodoAquisitivo, dataInicio, dataFim, diasCorridos, status (solicitado | aprovado | em_andamento | concluido | cancelado), observacoes
- **Operações:** CRUD para todos; abas Funcionários, Ponto, Folha, Férias
- **API:** `GET/POST/PATCH/DELETE /funcionarios`, `/registros-ponto`, `/folhas`, `/ferias`

### 2.11 Motorista (`motorista-app.tsx` + `ordem-servico-form.tsx`)

- **OrdemServicoMotorista:** agendamentoId, remetente (nome, endereco, cidade, estado, zipCode, telefone, cpfRg), destinatario (nome, cpfRg, endereco, bairro, cidade, estado, cep, telefone), caixas[] (id, tipo, numero, valor), assinaturaCliente, assinaturaAgente, dataAssinatura, motoristaId, motoristaNome, status (pendente | em_andamento | concluida), valorCobrado, observacoes
- **Operações:** motorista vê agendamentos confirmados; preenche ordem de serviço (remetente/destinatário/caixas/assinaturas); gera recibo
- **API:** `GET /agendamentos?status=confirmado` (para motorista), `GET/POST/PATCH /ordens-servico`, `GET /ordens-servico/:id`

---

## 3. Schema Departamento Estadual Rodovias (`schema.departamento-estadual-rodovias.prisma`) x Front

O schema já está alinhado ao domínio do front na maior parte. Resumo:

| Entidade backend (schema.departamento-estadual-rodovias)   | Front (tipos / uso)                          | Observações                                                                                                      |
| ---------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Company**                                                | Implícito (multi-tenant)                     | companyId em todas as entidades; front pode enviar header ou usar usuário logado                                 |
| **User** + **Roles** (ADMIN, FISCAL_CAMPO, OPERADOR, INSPETOR_VIA) | Auth: admin, comercial, logistico, motorista | Mapeamento direto; backend deve usar enum do schema Departamento Estadual Rodovias                               |
| **Cliente**                                                | Cliente                                      | Schema usa `enderecoUSA`/`destinoBrasil` como Json; front usa objetos tipados – garantir contrato (campos) igual |
| **Estoque**                                                | Estoque                                      | 1 por Company; caixasPequenas/Medias/Grandes, fitasAdesivas                                                      |
| **Agendamento**                                            | Agendamento                                  | Incluir rotaId opcional; status e campos batem                                                                   |
| **Container** + **ContainerCaixa**                         | Container                                    | tipo (enum C20FT etc.), status; caixas como relação                                                              |
| **Transacao**                                              | Transacao                                    | tipo receita/despesa, categoria, valor, data, metodoPagamento                                                    |
| **Rota**                                                   | Rota                                         | data, rotaOtimizada[], distanciaTotal, tempoEstimado; agendamentos vinculados                                    |
| **PrecoEntrega** / **PrecoProduto**                        | PrecoEntrega / PrecoProduto                  | PrecoProduto no schema tem tipo caixa/fita e campos de estoque                                                   |
| **Funcionario**                                            | Funcionario                                  | userId opcional; endereco/documentos Json; beneficios String[]                                                   |
| **RegistroPonto**, **Folha**, **Ferias**                   | RegistroPonto, Folha, Ferias                 | Campos alinhados; enums no schema (RegistroPontoTipo, FolhaStatus, FeriasStatus)                                 |
| **OrdemServicoMotorista**                                  | OrdemServicoMotorista                        | remetente/destinatario/caixas como Json; agendamentoId, motoristaId                                              |
| **Lead** + **LeadConversa**                                | Lead + conversas                             | status, prioridade, LeadConversaRemetente                                                                        |

Ajustes possíveis no schema (conforme necessidade real do front):

- **Cliente:** Garantir que os campos de `enderecoUSA` e `destinoBrasil` (Json) tenham a mesma estrutura usada no front (rua, numero, cidade, estado, zipCode, complemento; nomeRecebedor, cpfRecebedor, endereco, cidade, estado, cep, telefones).
- **Estoque:** Front em um lugar usa `fitas`; tipo e schema usam `fitasAdesivas` – padronizar.
- **Container.status:** Front usa valores como `preparando`, `em-transito`, `entregue`; schema usa `preparacao`, `transito`, `entregue`. Manter enum do schema e mapear no front ou ajustar enum para bater com o front.
- **OrdemServicoMotorista:** remetente/destinatario/caixas em Json – definir estrutura (ex.: igual à do front) para validação e documentação.

---

## 4. Backend atual (departamento-estadual-rodovias-api-lobocode) – o que não serve ao front

Módulos e entidades atuais (Departamento Estadual Rodovias):

- **users** – roles e lógica de postos/guarda; não é o mesmo que “funcionários” do RH Departamento Estadual Rodovias
- **companies** – pode ser reutilizado como “empresa” multi-tenant
- **posts** – postos de segurança; não existe no front Departamento Estadual Rodovias
- **shifts** – turnos de guarda; não existe no front
- **patrols** – rondas; não existe no front
- **checkpoints** – checkpoints de ronda; não existe no front
- **reports/** – ocorrências, checklists, férias/rescisões estilo segurança; não é o mesmo que Relatórios/Financeiro/RH Departamento Estadual Rodovias
- **vehicle** – veículos; não é módulo do front Departamento Estadual Rodovias
- **panic-events** – pânico; não existe no front
- **documents** – documentos; pode ser reutilizado
- **notifications** – notificações; pode ser reutilizado
- **service-bus** – filas; interno
- **shared/auth** – auth JWT; **manter**, mas ajustar roles para ADMIN/FISCAL_CAMPO/OPERADOR/INSPETOR_VIA quando usar schema Departamento Estadual Rodovias
- **shared/files** – upload; **manter**
- **shared/universal** – CRUD genérico; pode ser útil para entidades simples

Conclusão: a maior parte dos **módulos de negócio** atuais não corresponde ao front. O que **manter e reutilizar**: auth, companies, files, notifications, documents, Prisma, CASL, filtros, mensagens, multi-tenant. O que **criar**: módulos Departamento Estadual Rodovias (clientes, estoque, agendamentos, containers, transacoes, rotas, precos, funcionarios, ponto, folha, ferias, leads, ordens-servico) conforme o schema.departamento-estadual-rodovias e os tipos do front.

---

## 5. Plano de adaptação sugerido

### Fase 1 – Schema e base

1. **Ativar o schema Departamento Estadual Rodovias**
   - Trocar (ou unificar) o uso de `schema.prisma` para `schema.departamento-estadual-rodovias.prisma` (renomear/copiar para `schema.prisma` ou usar multi-schema se a stack permitir).
   - Rodar migrações em um banco dedicado ao Departamento Estadual Rodovias.
2. **Ajustar Auth/Users**
   - Roles: usar enum do schema Departamento Estadual Rodovias (ADMIN, FISCAL_CAMPO, OPERADOR, INSPETOR_VIA).
   - Manter login/refresh/logout; JWT com `role` e `companyId` para multi-tenant.
   - Se ainda existir tabela User do Departamento Estadual Rodovias, criar migração ou nova tabela User compatível com o schema Departamento Estadual Rodovias (name, email, login, password, role, companyId, status, etc.).

### Fase 2 – Módulos por prioridade (ordem sugerida)

1. **Clientes** – CRUD + listagem com filtros (base para agendamentos e transações).
2. **Estoque** – GET/PATCH por company (e depois movimentações se o front evoluir).
3. **Agendamentos** – CRUD + listagem; vínculo com Cliente e opcionalmente Rota.
4. **Containers** – CRUD + ContainerCaixa (incluído ou sub-recurso).
5. **Transacoes** – CRUD + listagem (financeiro).
6. **Rotas** – CRUD e associação a agendamentos.
7. **Precos** – PrecoEntrega e PrecoProduto (CRUD).
8. **Funcionarios** – CRUD (RH); depois RegistroPonto, Folha, Ferias.
9. **Leads** – CRUD + LeadConversa (atendimentos/pipe).
10. **OrdemServicoMotorista** – CRUD; listagem para motorista por agendamento.

Cada módulo: controller, service, DTOs, validações, guardas por role (e companyId). Padrão do projeto: repositório/validator/factory quando aplicável.

### Fase 3 – Front

1. **DataContext** – Passar a buscar/salvar via `api` (api.service): substituir estado inicial mock por `useEffect` que chama os novos endpoints e atualiza estado (ou usar React Query/SWR).
2. **Endpoints** – Garantir que URLs e payloads (request/response) sigam os tipos do front (Cliente, Agendamento, etc.); ajustar DTOs do backend para refletir esses contratos.
3. **Relatórios** – Usar listagens existentes com filtros de data ou criar endpoints específicos de relatório (visão geral, financeiro, etc.).
4. **Motorista** – Endpoint de agendamentos confirmados + CRUD de ordens de serviço; front já preparado para receber esses dados.

### Fase 4 – Ajustes finos

- **Estoque:** No front, o tipo e o DataContext usam `fitasAdesivas`, mas `dashboard.tsx` e `motorista-app.tsx` usam `estoque.fitas` (ficaria undefined). Corrigir no front para `estoque.fitasAdesivas` ou adicionar getter/alias; no backend manter `fitasAdesivas` como no schema.
- **Container status:** Mapear enums backend ↔ front (preparacao/preparando, etc.).
- **Permissões:** Replicar no backend a matriz do front (admin/comercial/logistico/motorista) usando CASL ou roles, para que os endpoints respeitem as mesmas regras que o front.

---

## 6. Resumo: entidades e endpoints alvo

| Módulo front | Entidades                                 | Endpoints sugeridos                                        |
| ------------ | ----------------------------------------- | ---------------------------------------------------------- |
| Clientes     | Cliente                                   | GET/POST /clientes, GET/PATCH/DELETE /clientes/:id         |
| Estoque      | Estoque                                   | GET/PATCH /estoque (ou /companies/:id/estoque)             |
| Agendamentos | Agendamento                               | GET/POST /agendamentos, GET/PATCH/DELETE /agendamentos/:id |
| Containers   | Container, ContainerCaixa                 | GET/POST /containers, GET/PATCH/DELETE /containers/:id     |
| Financeiro   | Transacao                                 | GET/POST /transacoes, GET/DELETE /transacoes/:id           |
| Rotas        | Rota                                      | GET/POST /rotas, GET/PATCH/DELETE /rotas/:id               |
| Preços       | PrecoEntrega, PrecoProduto                | /precos-entrega, /precos-produtos (CRUD)                   |
| RH           | Funcionario, RegistroPonto, Folha, Ferias | /funcionarios, /registros-ponto, /folhas, /ferias (CRUD)   |
| Atendimentos | Lead, LeadConversa                        | /leads, /leads/:id/conversas                               |
| Motorista    | OrdemServicoMotorista                     | GET/POST /ordens-servico, GET/PATCH /ordens-servico/:id    |
| Dashboard    | -                                         | Dados agregados dos endpoints acima ou GET /dashboard      |
| Relatórios   | -                                         | Filtros nos listagens ou GET /relatorios/...               |

---

## 7. Referências no repositório

- **Front (referência):** `departamento-estadual-rodoviasmanagementsystem/src/app/` – componentes, `context/DataContext.tsx`, `context/AuthContext.tsx`, `types/index.ts`
- **Schema domínio:** `departamento-estadual-rodovias-api-lobocode/prisma/schema.departamento-estadual-rodovias.prisma`
- **Auth front:** `departamento-estadual-rodoviasmanagementsystem/src/app/services/auth.service.ts`, `api.service.ts` (base URL e interceptors)
- **Backend atual:** `departamento-estadual-rodovias-api-lobocode/src/app.module.ts`, `src/modules/`

Com essa análise, o próximo passo é ativar o schema Departamento Estadual Rodovias, criar o primeiro módulo (ex.: Clientes) e, em paralelo, ir trocando o DataContext do front para consumir a API real.
