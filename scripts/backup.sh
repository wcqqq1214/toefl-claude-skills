#!/usr/bin/env bash
# TOEFL Claude Skills - 备份 ~/.toefl/ 到 tar.gz

set -e

TOEFL_DIR="$HOME/.toefl"
BACKUP_DIR="$TOEFL_DIR/backups"
DATE=$(date +%Y-%m-%d-%H%M%S)
OUT="$BACKUP_DIR/toefl-backup-$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

# 备份除 backups 自身外的所有内容
tar -czf "$OUT" -C "$TOEFL_DIR" \
  --exclude='backups' \
  . 2>/dev/null

echo "✓ 备份完成: $OUT"
echo "  大小: $(du -h "$OUT" | cut -f1)"

# 保留最近 10 份
cd "$BACKUP_DIR"
ls -t toefl-backup-*.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm
echo "  保留最近 10 份备份"
