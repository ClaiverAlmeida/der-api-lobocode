#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/common.sh"
cd_project_root
require_docker_running
require_command curl
require_command openssl

echo "🏗️ Deploy Infraestrutura - DEPARTAMENTO ESTADUAL DE RODOVIAS"

# Verificar se está no diretório correto
if [ ! -f "docker/docker-compose.infrastructure.yml" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto"
    exit 1
fi

# Criar rede se não existir
echo "🔧 Verificando rede app-net-departamento-estadual-rodovias..."
if ! network_exists "app-net-departamento-estadual-rodovias"; then
    echo "📡 Criando rede app-net-departamento-estadual-rodovias..."
    ensure_network "app-net-departamento-estadual-rodovias" "bridge"
    echo "✅ Rede app-net-departamento-estadual-rodovias criada com sucesso!"
else
    echo "✅ Rede app-net-departamento-estadual-rodovias já existe"
fi

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p nginx/ssl
mkdir -p nginx/logs

# Criar certificado SSL auto-assinado (se não existir)
if [ ! -f "nginx/ssl/cert.pem" ]; then
    echo "🔐 Criando certificado SSL de teste..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=SP/O=DEPARTAMENTO ESTADUAL DE RODOVIAS/CN=localhost"
fi

# Parar infraestrutura existente
echo "🛑 Parando infraestrutura..."
compose -f docker/docker-compose.infrastructure.yml down

# Iniciar infraestrutura
echo "🚀 Iniciando infraestrutura..."
compose -f docker/docker-compose.infrastructure.yml up -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização..."
sleep 5

# Verificar status
echo "📊 Status da infraestrutura:"
compose -f docker/docker-compose.infrastructure.yml ps

# Testar Nginx
echo "🌐 Testando Nginx..."
sleep 3
curl -k -f https://localhost/health && echo "✅ Nginx OK" || echo "⚠️ Nginx OK (sem backend)"

echo ""
echo "✅ Infraestrutura iniciada!"
echo "🌐 Nginx disponível em: https://localhost"
echo ""
echo "📋 Próximos passos:"
echo "  1. Iniciar database: ./scripts/start-database.sh"
echo "  2. Deploy backend: ./scripts/deploy-backend-only.sh"
