# Monitoramento com Grafana e Prometheus

Este guia explica como usar o Grafana e o Prometheus para monitorar seu backend NestJS, visualizar métricas e criar alertas de forma simples e eficiente.

---

## O que é o Grafana?

O **Grafana** é uma plataforma open source para visualização de dados e métricas em tempo real. Ele permite criar dashboards bonitos e interativos, facilitando o acompanhamento da saúde e performance do seu sistema.

O **Prometheus** é o serviço responsável por coletar e armazenar as métricas expostas pelo seu backend (por exemplo, no endpoint `/metrics`). O Grafana se conecta ao Prometheus para exibir essas métricas de forma visual.

---

## Como instalar e rodar Grafana e Prometheus

### Usando Docker Compose (recomendado)

Adicione ao seu `docker-compose.yml`:

```yaml
grafana:
  image: grafana/grafana:latest
  ports:
    - '30101:3000' # departamento-estadual-rodovias: host 30101
  depends_on:
    - prometheus
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana-data:/var/lib/grafana

prometheus:
  image: prom/prometheus:latest
  ports:
    - '19090:9090' # departamento-estadual-rodovias: host 19090
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  command:
    - --config.file=/etc/prometheus/prometheus.yml

volumes:
  grafana-data:
```

No mesmo diretório, crie o arquivo `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'nestjs-backend'
    metrics_path: /metrics
    static_configs:
      - targets: ['host.docker.internal:30100'] # departamento-estadual-rodovias: backend no host
```

> **Dica:** Se estiver rodando tudo em containers, use o nome do serviço do backend no lugar de `host.docker.internal`.

---

## Como acessar o Grafana

1. Suba os containers:
   ```bash
   docker-compose up -d
   ```
2. Acesse o Grafana em [http://localhost:30101](http://localhost:30101) (departamento-estadual-rodovias)
   - Usuário: `admin`
   - Senha: `admin` (ou a definida na variável de ambiente)

---

## Adicionando o Prometheus como fonte de dados

1. No menu lateral, clique em **"Engrenagem (⚙️) > Data Sources"**.
2. Clique em **"Add data source"**.
3. Selecione **Prometheus**.
4. Em **URL**, coloque: `http://prometheus:9090` (se estiver usando Docker Compose).
5. Clique em **Save & Test**.

---

## Importando um dashboard pronto para Node.js

1. No menu lateral, clique em **"+ > Import"**.
2. No campo **Import via grafana.com**, digite o ID `11074` (dashboard Node.js App) e clique em **Load**.
3. Selecione o Prometheus como fonte de dados.
4. Clique em **Import**.
5. Pronto! Você verá gráficos de CPU, memória, event loop, heap, etc.

---

## Principais métricas para observar

- **CPU:** `process_cpu_seconds_total`, `process_cpu_user_seconds_total`
- **Memória:** `process_resident_memory_bytes`, `nodejs_heap_size_used_bytes`
- **Event Loop:** `nodejs_eventloop_lag_seconds`
- **Handles/Recursos:** `nodejs_active_handles_total`, `nodejs_active_resources_total`
- **Erros:** Métricas customizadas podem ser criadas para contar erros HTTP, timeouts, etc.

---

## Criando alertas no Grafana

1. No dashboard, clique no gráfico desejado.
2. Clique em **"Edit"** e vá na aba **"Alert"**.
3. Configure a condição (ex: CPU > 80% por 5 minutos).
4. Defina o canal de notificação (e-mail, Slack, etc).

---

## Dicas finais

- Monitore o uso real do sistema para ajustar limites e planejar crescimento.
- Use dashboards prontos como base e personalize conforme sua necessidade.
- Combine métricas do backend, banco de dados e infraestrutura para uma visão completa.
- Revise periodicamente os alertas para evitar alarmes falsos ou falta de aviso em situações críticas.

---

**Com esse setup, você terá total visibilidade da saúde do seu backend NestJS!**

Se precisar de exemplos de queries, gráficos customizados ou integração com outros sistemas, consulte a documentação oficial ou peça ajuda aqui!
