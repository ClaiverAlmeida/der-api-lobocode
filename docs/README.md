# 📚 Índice de Documentação

Bem-vindo à central de documentação do projeto! Aqui você encontra guias, checklists e instruções detalhadas para facilitar o uso, manutenção e evolução do sistema.

## 🏗️ **Arquitetura e Sistema**

### **Módulos e Estrutura**

- [Módulo Users (arquitetura SOLID)](./README-users.md)
- [Sistema de Tenant/Multi-tenancy](./README-tenant-multitenancy.md)
- [Escopo do Sistema](./ESCOPO-SISTEMA.md)

### **Padrões de Desenvolvimento**

- [Padrões de Codificação](./CODING_STANDARDS.md)
- [Convenções de Nomenclatura](./NAMING_CONVENTIONS.md)
- [Plano de Desenvolvimento em Fases](./PLANO-DESENVOLVIMENTO-FASES.md)

## 🔐 **Autenticação e Segurança**

### **Sistema de Autenticação**

- [Refatoração do Módulo Auth](./AUTH-REFATORACAO.md)
- [AuthGuard com Exceções Customizadas](./AUTH-GUARD-CUSTOMIZADO.md)
- [Melhorias no Sistema de Erros de Auth](./ERRO-AUTH-MELHORADO.md)

### **Sistema de Filtros e Erros**

- [Estratégia de Erros Simples](./ESTRATEGIA-ERROS-SIMPLES.md)
- [Padronização de Mensagens de Auth](./PADRONIZACAO-MENSAGENS-AUTH.md)
- [Comparação de Respostas de Erro](./response-comparison.md)

## 🎯 **Frontend e Integração**

### **Tratamento de Erros**

- [Tratamento de Erros no Frontend](./frontend-error-handling.md)

## 🚀 **Desenvolvimento e Deploy**

### **Ambiente de Desenvolvimento**

- [Desenvolvimento](./DESENVOLVIMENTO.md)
- [Comandos úteis de Docker, Prisma e NestJS](./README-comandos.md)
- [Fundação Sólida - Fase 1](./FASE-1-FUNDACAO-SOLIDA.md)

### **Produção**

- [Produção](./PRODUCAO.md)
- [Checklist de Produção](./README-checklist-producao.md)
- [Monitoramento com Grafana e Prometheus](./README-grafana.md)

## 📁 **Documentações por Módulo**

### **Filtros de Exceção**

- [Sistema de Filtros](../src/shared/common/filters/README.md)

### **Sistema de Mensagens**

- [Sistema de Mensagens Centralizadas](../src/shared/common/messages/README.md)

### **Autenticação**

- [Módulo Auth](../src/shared/auth/README.md)

### **Validadores**

- [Validadores Customizados](../src/shared/validators/README.md)

### **CASL (Autorização)**

- [Sistema de Autorização](../src/shared/casl/README.md)

### **Usuários**

- [Módulo Users](../src/modules/users/README.md)

## 🔧 **Como Usar**

### **Para Desenvolvedores**

1. **Novos no projeto**: Comece pelo [README principal](../README.md)
2. **Arquitetura**: Consulte [Escopo do Sistema](./ESCOPO-SISTEMA.md)
3. **Padrões**: Veja [Padrões de Codificação](./CODING_STANDARDS.md)
4. **Módulos específicos**: Consulte os READMEs dentro das pastas dos módulos

### **Para Deploy**

1. **Desenvolvimento**: [Guia de Desenvolvimento](./DESENVOLVIMENTO.md)
2. **Produção**: [Guia de Produção](./PRODUCAO.md)
3. **Checklist**: [Checklist de Produção](./README-checklist-producao.md)

### **Para Manutenção**

1. **Monitoramento**: [Grafana e Prometheus](./README-grafana.md)
2. **Comandos úteis**: [Comandos Docker/Prisma/NestJS](./README-comandos.md)
3. **Troubleshooting**: Consulte documentações específicas por módulo

---

## 📊 **Status da Documentação**

- ✅ **Atualizada**: Arquitetura, Auth, Filtros, Mensagens
- ✅ **Completa**: Padrões, Deploy, Monitoramento
- ✅ **Revisada**: Sistema de erros, Frontend integration

## 📈 **Atualizações Recentes**

- ✅ **[Atualização da Documentação](./ATUALIZACAO-DOCUMENTACAO.md)** - Resumo das atualizações realizadas em Janeiro 2025

## 📊 **Relatórios de Progresso**

- **[Feedback para Cliente](./FEEDBACK-CLIENTE.md)** - Relatório de progresso e próximos passos
- **[Feedback para Sócios](./FEEDBACK-SOCIOS.md)** - Relatório técnico detalhado em linguagem acessível

---

**💡 Dica**: Mantenha esta documentação sempre atualizada conforme o sistema evolui! 