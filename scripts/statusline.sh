#!/usr/bin/env bash
# TOEFL Claude Skills - Claude Code statusLine 集成
# 读取 ~/.toefl/config.json，输出一行摘要给状态栏
# 在 ~/.claude/settings.json 中配置：
#   "statusLine": { "type": "command", "command": "bash /path/to/statusline.sh" }

set -e

CONFIG="$HOME/.toefl/config.json"
[ ! -f "$CONFIG" ] && { echo "TOEFL: 未配置 (/toefl 初始化)"; exit 0; }

command -v jq >/dev/null 2>&1 || { echo "TOEFL: 需要安装 jq"; exit 0; }

TARGET=$(jq -r '.target_score // "?"' "$CONFIG")
EXAM=$(jq -r '.exam_date // ""' "$CONFIG")
CURRENT=$(jq -r '.current_baseline.total // "?"' "$CONFIG")
WEAK=$(jq -r '.weakest_section // ""' "$CONFIG")

DAYS=""
if [ -n "$EXAM" ]; then
  EXAM_TS=$(date -d "$EXAM" +%s 2>/dev/null || echo "")
  NOW_TS=$(date +%s)
  if [ -n "$EXAM_TS" ]; then
    DIFF=$(( (EXAM_TS - NOW_TS) / 86400 ))
    DAYS=" · D-$DIFF"
  fi
fi

# 简短格式: TOEFL 84→100 D-99 [weak:speaking]
OUT="TOEFL $CURRENT→$TARGET$DAYS"
[ -n "$WEAK" ] && [ "$WEAK" != "null" ] && OUT="$OUT [weak:$WEAK]"

echo "$OUT"
