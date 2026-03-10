# 🚀 Guia de Produção - DEPARTAMENTO ESTADUAL DE RODOVIAS

Este documento contém todas as informações necessárias para fazer o deploy da aplicação em produção.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Domínio configurado (ex: `seudominio.com`)
- Certificados SSL (Let's Encrypt ou similar)
- Servidor com mínimo 4GB RAM e 2 vCPUs

## 🏗️ Estrutura de Arquivos

```
departamento-estadual-rodovias-engine/
├── docker-compose.prod.yml    # Configuração de produção
├── env.production             # Variáveis de ambiente
├── deploy.sh                  # Script de deploy
├── Dockerfile.prod           # Dockerfile otimizado
├── nginx/
│   └── nginx.conf            # Configuração do Nginx
└── docs/
    └── PRODUCAO.md           # Este arquivo
```

## 🔧 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Edite o arquivo `env.production`:

```bash
# Database
DB_NAME=departamento_estadual_rodovias_prod
DB_PASSWORD=sua_senha_super_segura
JWT_SECRET=seu_jwt_secret_super_seguro

# URLs
API_URL=https://api.seudominio.com
# Frontend será servido por outro projeto
```

### 2. Configurar SSL

Crie a pasta para certificados:

```bash
mkdir -p nginx/ssl
```

Adicione seus certificados:

- `nginx/ssl/cert.pem` - Certificado SSL
- `nginx/ssl/key.pem` - Chave privada

### 3. Configurar Domínios

Edite o arquivo `nginx/nginx.conf` e substitua:

- `seudominio.com` pelo seu domínio
- `api.seudominio.com` pelo subdomínio da API
- `grafana.seudominio.com` pelo subdomínio do Grafana

## 🚀 Deploy

### Deploy Completo

```bash
# Build + Deploy
./deploy.sh full
```

### Comandos Individuais

```bash
# Apenas build das imagens
./deploy.sh build

# Apenas deploy
./deploy.sh deploy

# Verificar saúde dos serviços
./deploy.sh health

# Ver logs
./deploy.sh logs

# Fazer backup
./deploy.sh backup

# Monitorar recursos
./deploy.sh monitor
```

## 📊 Monitoramento

### Acessos

- **Frontend**: Servido por projeto separado
- **API**: https://api.seudominio.com
- **Grafana**: https://grafana.seudominio.com (admin/admin123!)
- **Prometheus**: http://localhost:19090 (departamento-estadual-rodovias)

### Health Checks

```bash
# Verificar status dos containers
docker compose -f docker-compose.prod.yml ps

# Verificar logs
docker compose -f docker-compose.prod.yml logs -f

# Verificar recursos
docker stats
```

## 🔒 Segurança

### Configurações Implementadas

- ✅ **HTTPS obrigatório** com redirecionamento automático
- ✅ **Headers de segurança** (HSTS, XSS Protection, etc.)
- ✅ **Rate limiting** na API (10 req/s por IP)
- ✅ **Usuário não-root** nos containers
- ✅ **Health checks** automáticos
- ✅ **Backup automático** do banco de dados

### Recomendações Adicionais

1. **Firewall**:

   ```bash
   # Permitir apenas portas necessárias
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 22/tcp
   ufw enable
   ```

2. **Fail2ban**:

   ```bash
   # Instalar e configurar fail2ban
   apt install fail2ban
   ```

3. **Backup externo**:
   ```bash
   # Configurar backup para cloud storage
   # Ex: AWS S3, Google Cloud Storage
   ```

## 📈 Escalabilidade

### Configurações Atuais

- **Backend**: 2 réplicas
- **Frontend**: Servido por projeto separado
- **Load Balancer**: Nginx com least_conn
- **Cache**: Redis com 256MB

### Para Escalar

1. **Aumentar réplicas**:

   ```yaml
   # docker-compose.prod.yml
   deploy:
     replicas: 4 # Aumentar de 2 para 4
   ```

2. **Aumentar recursos**:

   ```yaml
   deploy:
     resources:
       limits:
         memory: 2G # Aumentar memória
         cpus: '1.0' # Aumentar CPU
   ```

3. **Adicionar mais servidores**:
   - Usar Docker Swarm ou Kubernetes
   - Configurar load balancer externo

## 🔄 Manutenção

### Backup Automático

O sistema faz backup automático diário às 2h da manhã:

```bash
# Verificar backups
ls -la backups/

# Restaurar backup
gunzip -c backups/backup_20241201_020000.sql.gz | docker compose -f docker-compose.prod.yml exec -T db psql -U postgres departamento_estadual_rodovias_prod
```

### Atualizações

```bash
# 1. Fazer backup
./deploy.sh backup

# 2. Atualizar código
git pull origin main

# 3. Deploy
./deploy.sh full

# 4. Verificar saúde
./deploy.sh health
```

### Limpeza

```bash
# Limpar recursos não utilizados
./deploy.sh cleanup

# Verificar espaço em disco
df -h
docker system df
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Container não inicia**:

   ```bash
   # Verificar logs
   docker compose -f docker-compose.prod.yml logs [servico]

   # Verificar recursos
   docker stats
   ```

2. **Erro de conexão com banco**:

   ```bash
   # Verificar se o banco está rodando
   docker compose -f docker-compose.prod.yml exec db pg_isready

   # Verificar logs do banco
   docker compose -f docker-compose.prod.yml logs db
   ```

3. **Erro de SSL**:

   ```bash
   # Verificar certificados
   openssl x509 -in nginx/ssl/cert.pem -text -noout

   # Testar configuração do Nginx
   docker compose -f docker-compose.prod.yml exec nginx nginx -t
   ```

### Logs Importantes

```bash
# Logs do Nginx
docker compose -f docker-compose.prod.yml logs nginx

# Logs da aplicação
docker compose -f docker-compose.prod.yml logs backend

# Logs do banco
docker compose -f docker-compose.prod.yml logs db
```

## 📞 Suporte

Em caso de problemas:

1. Verificar logs: `./deploy.sh logs`
2. Verificar saúde: `./deploy.sh health`
3. Fazer backup: `./deploy.sh backup`
4. Reiniciar serviços: `./deploy.sh restart`

## 📝 Checklist de Produção

- [ ] Variáveis de ambiente configuradas
- [ ] Certificados SSL instalados
- [ ] Domínios configurados
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Health checks funcionando
- [ ] Rate limiting ativo
- [ ] Logs sendo coletados
- [ ] Documentação atualizada

## ⚠️ O que NÃO vai para produção

- **ERD do Prisma**: O bloco `generator erd` foi removido do `schema.prisma` para evitar erros no build de produção. Para gerar o diagrama ERD, adicione o bloco apenas localmente e rode:
  ```bash
  npm install -D prisma-erd-generator puppeteer
  npx prisma generate
  # O arquivo ERD.svg será gerado na pasta prisma/
  ```
- **Seeds e scripts de debug**: Use apenas localmente, nunca no container de produção.
- **Volumes de código/hot-reload**: Só no docker-compose de desenvolvimento.
- **Dependências de dev**: Não são instaladas no build de produção.

## 💻 Como usar recursos de desenvolvimento localmente

1. **Gerar ERD do Prisma**
   - Adicione o bloco abaixo ao seu `prisma/schema.prisma`:
     ```prisma
     generator erd {
       provider = "prisma-erd-generator"
       output   = "./ERD.svg"
     }
     ```
   - Instale as dependências:
     ```bash
     npm install -D prisma-erd-generator puppeteer
     ```
   - Gere o diagrama:
     ```bash
     npx prisma generate
     ```

2. **Rodar seeds**
   - Use o script localmente:
     ```bash
     npm run prisma:seed
     ```

3. **Debug e hot-reload**
   - Use o `docker-compose.yml` (dev) com volumes e `start:dev`.

4. **Ferramentas extras**
   - Qualquer ferramenta de desenvolvimento (ex: Prisma Studio, ERD, seeds) deve ser usada apenas localmente, nunca no build de produção.

---

**Resumo:**

- Produção = só o essencial, enxuto e seguro.
- Desenvolvimento = recursos extras para facilitar seu dia a dia, mas nunca vão para o container de produção.

Se quiser automatizar a troca do schema ou dos scripts, posso criar um script para isso também!
