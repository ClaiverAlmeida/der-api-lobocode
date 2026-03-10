#!/bin/bash

echo "🚀 Iniciando Backend DEPARTAMENTO ESTADUAL DE RODOVIAS..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose -f docker/docker-compose.backend.yml down

# Iniciar backend
echo "▶️ Iniciando backend..."
docker compose -f docker/docker-compose.backend.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 15

# Verificar status
echo "📊 Status dos containers:"
docker compose -f docker/docker-compose.backend.yml ps

echo ""
echo "✅ Backend iniciado!"
echo "🌐 API disponível em: http://localhost:30100 (departamento-estadual-rodovias)"
echo "🗄️ PostgreSQL disponível em: localhost:15432"
echo "⚡ Redis disponível em: localhost:16379"
echo "📁 MinIO disponível em: http://localhost:19000 (API) e http://localhost:19001 (Console)"
echo ""
echo "📋 Comandos úteis:"
echo "  - Logs: docker compose -f docker/docker-compose.backend.yml logs -f backend"
echo "  - Parar: docker compose -f docker/docker-compose.backend.yml down"
echo "  - Restart: docker compose -f docker/docker-compose.backend.yml restart backend"
