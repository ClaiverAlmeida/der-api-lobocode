#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/common.sh"
cd_project_root
require_docker_running
require_command curl

echo "🚀 Deploy Backend Apenas - DEPARTAMENTO ESTADUAL DE RODOVIAS"

COMPOSE="docker/docker-compose.prod.yml"
BACKEND="departamento-estadual-rodovias-backend"

if [ ! -f "$COMPOSE" ]; then
    echo "❌ Erro: Execute na raiz do projeto"
    exit 1
fi
if [ ! -f ".env" ]; then
    echo "❌ Erro: .env não encontrado na raiz"
    exit 1
fi

echo "🔧 Verificando rede app-net-departamento-estadual-rodovias..."
ensure_network "app-net-departamento-estadual-rodovias" "bridge"

echo "🔍 Verificando infraestrutura..."
if ! docker ps --format '{{.Names}}' | grep -q '^departamento-estadual-rodovias-db$'; then
    echo "⚠️ Database não está rodando. Execute: ./scripts/start-database.sh"
    exit 1
fi
if ! docker ps --format '{{.Names}}' | grep -q '^departamento-estadual-rodovias-redis$'; then
    echo "⚠️ Redis não está rodando. Execute: ./scripts/start-database.sh"
    exit 1
fi

# Remove backend órfão de projetos compose antigos
echo "🛑 Limpando backend antigo (se existir)..."
docker rm -f "$BACKEND" 2>/dev/null || true

echo "🔨 Reconstruindo backend..."
compose --env-file .env -f "$COMPOSE" up -d --build backend

echo "⏳ Aguardando inicialização..."
sleep 15

echo "📊 Status do backend:"
compose --env-file .env -f "$COMPOSE" ps backend

echo "🏥 Testando health check local..."
for i in $(seq 1 30); do
    if curl -sSf http://127.0.0.1:3011/health >/dev/null; then
        echo "✅ Backend OK"
        echo "🌐 API local: http://localhost:3011"
        exit 0
    fi
    sleep 2
done

echo "❌ Backend falhou"
compose --env-file .env -f "$COMPOSE" logs --tail=120 backend || true
exit 1
