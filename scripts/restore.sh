#!/usr/bin/env bash
# TOEFL 2026 Skills - 从备份恢复 ~/.toefl/
# 用法: ./restore.sh [backup-file.tar.gz]
# 不带参数则列出最近备份让用户选

set -e

TOEFL_DIR="$HOME/.toefl"
BACKUP_DIR="$TOEFL_DIR/backups"

if [ -z "$1" ]; then
  echo "可用备份："
  ls -lht "$BACKUP_DIR"/toefl-backup-*.tar.gz 2>/dev/null | head -10 || { echo "没有备份文件"; exit 1; }
  echo ""
  echo "用法: $0 <backup-file.tar.gz>"
  exit 0
fi

BACKUP_FILE="$1"
[ ! -f "$BACKUP_FILE" ] && BACKUP_FILE="$BACKUP_DIR/$(basename "$1")"
[ ! -f "$BACKUP_FILE" ] && { echo "✗ 找不到备份文件: $1"; exit 1; }

echo "⚠ 即将从 $BACKUP_FILE 恢复"
echo "  当前 ~/.toefl/ 内容将被合并（相同文件会被覆盖）"
read -p "继续？(y/N) " confirm
[ "$confirm" != "y" ] && { echo "已取消"; exit 0; }

tar -xzf "$BACKUP_FILE" -C "$TOEFL_DIR"
echo "✓ 恢复完成"
