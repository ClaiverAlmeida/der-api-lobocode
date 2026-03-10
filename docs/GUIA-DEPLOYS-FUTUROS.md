# 🚀 Guia de Deploys Futuros - Backend DEPARTAMENTO ESTADUAL DE RODOVIAS

## ✅ Configuração Atual

A **porta 30100 (departamento-estadual-rodovias)** já está configurada permanentemente no arquivo `docker-compose.backend.yml`. Isso significa que **não precisa configurar nada** para futuros deploys!

### 📋 Configuração Permanente

```yaml
# docker-compose.backend.yml
backend:
  ports:
    - '30100:3000' # departamento-estadual-rodovias: host 30100
```

## 🚀 Processo de Deploy para Novas Features

### Opção 1: Deploy Apenas do Backend (Recomendado)

```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Deploy apenas do backend
./scripts/deploy-backend-only.sh
```

### Opção 2: Deploy Completo

```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Deploy completo
./scripts/deploy.sh unified
```

### Opção 3: Deploy Manual

```bash
# 1. Fazer pull das mudanças
git pull origin main

# 2. Parar backend atual
docker stop departamento-estadual-rodovias-backend

# 3. Reconstruir e iniciar
docker compose -f docker-compose.backend.yml up -d --build backend
```

## 🔄 O Que Acontece Durante o Deploy

### ✅ Processo Automático

1. **Para o container atual** (se estiver rodando)
2. **Reconstrói a imagem** com as novas features
3. **Inicia o novo container** com a mesma configuração de porta
4. **Mantém a porta 30100 exposta** automaticamente (departamento-estadual-rodovias)
5. **Executa health checks** para verificar se está funcionando

### 🛡️ Segurança

- **Zero downtime**: O novo container só inicia após o anterior parar
- **Rollback automático**: Se falhar, o container anterior continua rodando
- **Health checks**: Verifica se a aplicação está respondendo

## 📊 Verificação Pós-Deploy

### Comandos de Verificação

```bash
# 1. Verificar se o container está rodando
docker ps | grep departamento-estadual-rodovias-backend

# 2. Verificar se a porta está exposta
netstat -tlnp | grep :3000

# 3. Testar health check
curl http://localhost:30100/health

# 4. Verificar logs
docker logs departamento-estadual-rodovias-backend

# 5. Teste completo
./test-connectivity.sh
```

### ✅ Checklist Pós-Deploy

- [ ] Container está rodando: `docker ps | grep departamento-estadual-rodovias-backend`
- [ ] Porta 30100 está exposta: `0.0.0.0:30100->3000/tcp`
- [ ] Health check responde: `curl localhost:30100/health`
- [ ] Logs sem erros: `docker logs departamento-estadual-rodovias-backend`
- [ ] Acesso externo funciona: `curl http://31.97.166.94:30100/health`

## 🚨 Cenários Especiais

### 🔧 Se a Porta Não Estiver Exposta

```bash
# Verificar configuração
docker compose -f docker-compose.backend.yml config | grep ports

# Se não estiver configurado, editar o arquivo
nano docker-compose.backend.yml
# Adicionar: ports: ['30100:3000']  # departamento-estadual-rodovias

# Reiniciar
docker compose -f docker-compose.backend.yml up -d backend
```

### 🔄 Se Precisar Mudar a Porta

```bash
# Editar docker-compose.backend.yml
ports:
  - '8080:3000'  # Mudar para porta 8080 externamente

# Reiniciar
docker compose -f docker-compose.backend.yml up -d backend
```

### 🛠️ Se Houver Problemas

```bash
# 1. Verificar logs
docker logs departamento-estadual-rodovias-backend

# 2. Verificar status
docker ps -a | grep departamento-estadual-rodovias-backend

# 3. Reiniciar forçadamente
docker stop departamento-estadual-rodovias-backend
docker rm departamento-estadual-rodovias-backend
docker compose -f docker-compose.backend.yml up -d backend

# 4. Testar conectividade
./test-connectivity.sh
```

## 📋 Scripts Disponíveis

### 🚀 Scripts de Deploy

- `./scripts/deploy.sh` - Script principal com múltiplas opções
- `./scripts/deploy-backend-only.sh` - Deploy apenas do backend
- `./scripts/deploy-unified.sh` - Deploy completo
- `./scripts/deploy-infrastructure.sh` - Deploy da infraestrutura

### 🔍 Scripts de Diagnóstico

- `./test-connectivity.sh` - Teste completo de conectividade
- `./scripts/network-manager.sh` - Gerenciar rede Docker

### 📊 Scripts de Monitoramento

- `./scripts/start-monitoring.sh` - Iniciar Prometheus/Grafana
- `./scripts/backup.sh` - Backup do banco de dados

## 🎯 Resumo para Deploys Futuros

### ✅ **NÃO PRECISA CONFIGURAR NADA**

A porta 30100 já está configurada permanentemente no `docker-compose.backend.yml` (departamento-estadual-rodovias).

### 🚀 **Processo Simples**

1. `git pull origin main`
2. `./scripts/deploy-backend-only.sh`
3. Pronto! ✅

### 🔍 **Verificação Rápida**

```bash
# Teste rápido
curl http://31.97.166.94:30100/health

# Ou use o script completo
./test-connectivity.sh
```

## 📞 Suporte

Se algo der errado:

1. Execute `./test-connectivity.sh`
2. Verifique os logs: `docker logs departamento-estadual-rodovias-backend`
3. Consulte o arquivo `SOLUCAO-PROBLEMA-PORTA-3000.md`

---

**🎉 Conclusão**: A configuração da porta está **permanente e automática**. Para futuros deploys, basta executar o script de deploy e a porta 30100 (departamento-estadual-rodovias) continuará funcionando!
