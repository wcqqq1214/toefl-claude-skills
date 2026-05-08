#!/usr/bin/env bash
# TOEFL Claude Skills - Dashboard 启动器（用户脚本）
# 不是 skill，直接 bash 跑

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASH_DIR="$SCRIPT_DIR/../dashboard"

command -v node >/dev/null 2>&1 || { echo "需要 Node.js v18+"; exit 1; }

cd "$DASH_DIR"

if [ ! -d node_modules ]; then
  echo "首次启动——安装依赖（约 30 秒）..."
  npm install
fi

echo "启动 Dashboard: http://localhost:5173"
echo "停止: Ctrl+C"
npm run dev
