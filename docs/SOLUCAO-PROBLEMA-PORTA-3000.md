# 🔧 Solução: Exposição da Porta do Backend

> **Departamento de Estradas de Rodagem:** o projeto usa a **porta 30100** no host (bloco 30xxx, para não conflitar com vários projetos). Nos exemplos abaixo, use `30100` onde aparecer porta do backend.

## ✅ Status Atual

- ✅ Backend está rodando na porta 30100 (host departamento-estadual-rodovias)
- ✅ Container está saudável
- ✅ Porta está exposta corretamente (0.0.0.0:30100->3000/tcp)
- ✅ Aplicação responde localmente
- ✅ Aplicação responde via IP interno

## 🌐 URLs de Acesso (departamento-estadual-rodovias)

```
http://31.97.166.94:30100
http://31.97.166.94:30100/health
```

## 🔍 Diagnóstico Realizado

### 1. Problema Identificado

O container do backend estava rodando mas **não tinha a porta exposta** para fora do container.

### 2. Solução Aplicada

- Paramos o container antigo
- Editamos o `docker-compose.backend.yml` para incluir o mapeamento de porta
- Reiniciamos o container com a nova configuração

### 3. Configuração Atual

```yaml
# docker-compose.backend.yml
backend:
  ports:
    - '30100:3000' # departamento-estadual-rodovias: host 30100
```

## 🚨 Se Ainda Não Conseguir Acessar Externamente

### Verificação 1: Firewall do Provedor

Muitos provedores de nuvem bloqueiam portas por padrão. Verifique:

1. **AWS**: Security Groups → Inbound Rules → Adicionar porta 30100 (departamento-estadual-rodovias)
2. **Google Cloud**: VPC Network → Firewall → Adicionar regra para porta 30100
3. **Azure**: Network Security Groups → Inbound Security Rules
4. **DigitalOcean**: Networking → Firewalls → Adicionar regra para porta 30100
5. **Vultr**: Firewall → Adicionar regra para porta 30100

### Verificação 2: Teste de Conectividade

Execute este comando para testar:

```bash
# De fora da VPS (seu computador local)
curl http://31.97.166.94:30100/health
```

### Verificação 3: Porta Alternativa

Se a porta 30100 estiver bloqueada, podemos usar outra porta:

```bash
# Editar docker-compose.backend.yml
ports:
  - '8080:3000'  # Usar porta 8080 no host
```

## 🛠️ Comandos Úteis

### Verificar Status

```bash
# Status dos containers
docker ps | grep departamento-estadual-rodovias-backend

# Logs do backend
docker logs departamento-estadual-rodovias-backend

# Teste de conectividade
curl http://localhost:30100/health
```

### Reiniciar Backend

```bash
# Parar e remover container
docker stop departamento-estadual-rodovias-backend
docker rm departamento-estadual-rodovias-backend

# Reiniciar com nova configuração
docker compose -f docker-compose.backend.yml up -d backend
```

### Verificar Portas

```bash
# Verificar se a porta está escutando
netstat -tlnp | grep :30100

# Testar conectividade
telnet 31.97.166.94 30100
```

## 📋 Checklist de Verificação

- [ ] Container está rodando: `docker ps | grep departamento-estadual-rodovias-backend`
- [ ] Porta está exposta: `0.0.0.0:30100->3000/tcp`
- [ ] Aplicação responde localmente: `curl localhost:30100/health`
- [ ] Aplicação responde via IP: `curl 31.97.166.94:30100/health`
- [ ] Firewall do provedor permite porta 30100
- [ ] Regras de segurança (Security Groups) configuradas

## 🆘 Próximos Passos

Se ainda não conseguir acessar:

1. **Verifique o firewall do provedor** (mais comum)
2. **Teste de outra máquina/rede**
3. **Use uma porta alternativa** (8080, 8000, etc.)
4. **Configure um proxy reverso** (nginx)
5. **Use HTTPS** se necessário

## 📞 Suporte

Se precisar de mais ajuda:

- Execute o script: `./test-connectivity.sh`
- Verifique os logs: `docker logs departamento-estadual-rodovias-backend`
- Teste de fora da VPS: `curl http://31.97.166.94:30100/health`
