#!/bin/bash
# backup.sh — Скрипт автоматичного резервного копіювання БД SmartInventory (ЛР5)
# Розташування: /opt/smart-inventory/backup.sh
# Cron: 0 2 * * * /bin/bash /opt/smart-inventory/backup.sh > /dev/null 2>&1

BACKUP_DIR="/opt/smart-inventory/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR
docker compose exec -T postgres_db pg_dumpall -U db_admin | gzip > $BACKUP_FILE

# Видалення бекапів, старших за 30 днів
find $BACKUP_DIR -type f -mtime +30 -name "*.gz" -exec rm {} \;

echo "[$(date)] Backup completed: $BACKUP_FILE"
