#!/bin/bash

# Script de backup simples para VPS
BACKUP_DIR="/home/claiver/projetos/ifraseg-engine/backups"
DB_NAME="departamento-estadual-rodovias-engine"
DB_USER="super_admin"
RETENTION_DAYS=7

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Data atual
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

echo "🗄️ Iniciando backup do banco de dados..."

# Fazer backup (DB está no compose database dedicado)
docker compose -f docker/docker-compose.database.yml --env-file .env exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

# Comprimir backup
gzip $BACKUP_FILE

echo "✅ Backup criado: $BACKUP_FILE.gz"

# Remover backups antigos (mais de 7 dias)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "🧹 Backups antigos removidos (mais de $RETENTION_DAYS dias)"

# Mostrar tamanho do backup
BACKUP_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
echo "📊 Tamanho do backup: $BACKUP_SIZE"
