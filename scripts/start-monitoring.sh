#!/bin/bash

echo "📊 Iniciando Monitoramento DEPARTAMENTO ESTADUAL DE RODOVIAS..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose -f docker/docker-compose.monitoring.yml down

# Iniciar monitoramento
echo "▶️ Iniciando monitoramento..."
docker compose -f docker/docker-compose.monitoring.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker compose -f docker/docker-compose.monitoring.yml ps

echo ""
echo "✅ Monitoramento iniciado!"
echo "📈 Prometheus disponível em: http://localhost:19090 (departamento-estadual-rodovias)"
echo "📊 Grafana disponível em: http://localhost:30101 (departamento-estadual-rodovias)"
echo "   - Usuário: admin"
echo "   - Senha: admin"
echo ""
echo "📋 Comandos úteis:"
echo "  - Logs: docker compose -f docker/docker-compose.monitoring.yml logs -f"
echo "  - Parar: docker compose -f docker/docker-compose.monitoring.yml down"
