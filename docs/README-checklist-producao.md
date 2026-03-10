# Checklist de Produção – Backend NestJS

Este checklist vai te ajudar a garantir que seu sistema está pronto para rodar em produção com segurança, performance e monitoramento profissional.

---

## 1. Monitoramento e Observabilidade

- [ ] Endpoint `/metrics` exposto e Prometheus coletando métricas
- [ ] Grafana com dashboards configurados
- [ ] Alertas configurados para CPU, memória, tempo de resposta e taxa de erro
- [ ] Logs de aplicação centralizados e com nível adequado (info, warn, error)
- [ ] Métricas customizadas para erros HTTP (ex: 500, 400, 401)
- [ ] (Avançado) Trace de requisições ponta a ponta (OpenTelemetry/Jaeger)

## 2. Performance

- [ ] Todas as listagens com paginação obrigatória
- [ ] Queries otimizadas e com índices no banco
- [ ] Pool de conexões do banco configurado
- [ ] Cache implementado para dados que mudam pouco (Redis, etc)
- [ ] Testes de carga realizados (k6 ou similar) e resultados analisados

## 3. Segurança

- [ ] Endpoints sensíveis protegidos por autenticação e autorização
- [ ] Rate limit configurado para evitar brute force
- [ ] Dados sensíveis nunca expostos em logs ou respostas
- [ ] Variáveis de ambiente seguras (nunca versionadas)
- [ ] Dependências atualizadas e sem vulnerabilidades conhecidas

## 4. Testes

- [ ] Testes unitários para regras de negócio críticas
- [ ] Testes de integração para endpoints principais
- [ ] Testes de carga automatizados (opcional)

## 5. Documentação

- [ ] README atualizado com instruções de uso e setup
- [ ] Documentação da API (Swagger/OpenAPI) disponível e atualizada
- [ ] Documentação de endpoints de métricas e monitoramento

## 6. Infraestrutura

- [ ] Rotina de backup do banco de dados configurada
- [ ] Deploy automatizado (CI/CD) implementado
- [ ] Variáveis de ambiente separadas para produção, staging e dev
- [ ] Logs e métricas persistentes (não se perdem em restart)
- [ ] (Avançado) Balanceador de carga configurado para múltiplas instâncias

---

## Dicas finais

- Revise o checklist antes de cada deploy importante.
- Monitore o sistema nos primeiros dias após subir para produção.
- Ajuste limites e alertas conforme o uso real.
- Compartilhe o checklist com o time!

---

**Com esse checklist, seu sistema estará muito mais seguro, estável e pronto para crescer!** 