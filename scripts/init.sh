#!/usr/bin/env bash
# TOEFL Claude Skills - 初始化 ~/.toefl/ 数据目录
# 幂等：可以反复运行，不会覆盖已有数据

set -e

TOEFL_DIR="$HOME/.toefl"

mkdir -p "$TOEFL_DIR"/{writing,reading,listening,speaking,errors,synonyms,vocab,plans,backups}

init_json() {
  local path="$1"
  local content="$2"
  [ ! -f "$path" ] && echo "$content" > "$path"
}

init_json "$TOEFL_DIR/writing/index.json"   '{"entries":[]}'
init_json "$TOEFL_DIR/reading/index.json"   '{"entries":[]}'
init_json "$TOEFL_DIR/listening/index.json" '{"entries":[]}'
init_json "$TOEFL_DIR/speaking/index.json"  '{"entries":[]}'
init_json "$TOEFL_DIR/errors/tags.json"     '{"tags":{},"updated_at":""}'
init_json "$TOEFL_DIR/synonyms/library.json" '{"entries":[],"updated_at":""}'
init_json "$TOEFL_DIR/vocab/srs.json"       '{"queue":[],"updated_at":""}'

# config.json 不自动创建——由 /toefl 摸底时写入

echo "TOEFL data dir ready: $TOEFL_DIR"
