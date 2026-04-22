#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/common.sh"
cd_project_root
require_docker_running

set -e

COMPOSE_FILE="docker/docker-compose.database.yml"
# Projeto definido em docker-compose.database.yml (name: der-api-lobocode-database)

echo "🗄️ Iniciando Banco de Dados DEPARTAMENTO ESTADUAL DE RODOVIAS..."

echo "🛑 Parando apenas os serviços deste compose (projeto der-api-lobocode-database)..."
compose -f "$COMPOSE_FILE" down

# Migração: instâncias criadas com o projeto Compose antigo (ex.: nome "docker") não entram no
# "down" do projeto atual; container_name fixo no YAML continua ocupado e o "up" falha.
DER_DB_CONTAINERS=(departamento-estadual-rodovias-db departamento-estadual-rodovias-redis)
echo "🧹 Removendo contentores órfãos deste stack (se existirem): ${DER_DB_CONTAINERS[*]}"
docker rm -f "${DER_DB_CONTAINERS[@]}" 2>/dev/null || true

echo "▶️ Iniciando banco de dados..."
compose -f "$COMPOSE_FILE" up -d

echo "⏳ Aguardando inicialização..."
sleep 10

echo "📊 Status dos containers:"
compose -f "$COMPOSE_FILE" ps

echo ""
echo "✅ Banco de dados iniciado!"
echo "🗄️ PostgreSQL disponível em: localhost:3211"
echo "⚡ Redis disponível em: localhost:3911"
echo ""
echo "📋 Comandos úteis:"
echo "  - Logs: docker compose -f $COMPOSE_FILE logs -f"
echo "  - Parar: docker compose -f $COMPOSE_FILE down"
echo "  - Conectar: docker compose -f $COMPOSE_FILE exec db psql -U postgres -d mydb"
