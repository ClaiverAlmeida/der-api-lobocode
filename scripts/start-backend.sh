#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/common.sh"
cd_project_root
require_docker_running

echo "🚀 Iniciando Backend DEPARTAMENTO ESTADUAL DE RODOVIAS..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
compose -f docker/docker-compose.backend.yml down

# Iniciar backend
echo "▶️ Iniciando backend..."
compose -f docker/docker-compose.backend.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 15

# Verificar status
echo "📊 Status dos containers:"
compose -f docker/docker-compose.backend.yml ps

echo ""
echo "✅ Backend iniciado!"
echo "🌐 API disponível em: http://localhost:3011"
echo "🗄️ PostgreSQL disponível em: localhost:3211"
echo "⚡ Redis disponível em: localhost:3911"
echo "📁 MinIO disponível em: http://localhost:3311 (API) e http://localhost:3312 (Console)"
echo ""
echo "📋 Comandos úteis:"
echo "  - Logs: docker compose -f docker/docker-compose.backend.yml logs -f backend"
echo "  - Parar: docker compose -f docker/docker-compose.backend.yml down"
echo "  - Restart: docker compose -f docker/docker-compose.backend.yml restart backend"
