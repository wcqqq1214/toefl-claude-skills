# TOEFL Claude Skills

> 一套跑在 Claude Code 上的托福备考 AI 教练系统。
> **数据驱动、个人化训练、可视化。** 装上就能用。

---

## 这是什么

7 个 [Claude Code Skill](https://docs.claude.com/en/docs/claude-code/skills) + 1 个 Dashboard + 脚本工具链，构成一个完整的托福备考助手：

| Skill | 干啥 | 触发词 |
|-------|------|--------|
| `/toefl` | 路由入口 + 摸底 + 写入 config | 「我要备考托福」「TOEFL」 |
| `/toefl-reading` | 10 种题型拆解 + 同义替换 + 错题诊断 | 「分析阅读」「这道为什么错」 |
| `/toefl-listening` | 6 种题型错因三分诊断 + 精听任务 + 笔记法 | 「听力错题」「精听」 |
| `/toefl-writing` | Integrated + Academic Discussion 批改 | 「批改作文」「综合写作」 |
| `/toefl-speaking` | 4 个 Task 模板 + 笔记框架 + 批改 | 「口语模板」「Task 3 准备」 |
| `/toefl-vocab` | SRS 间隔重复 + 同义替换训练 | 「背单词」「同义替换」 |
| `/toefl-diagnose` | 数据驱动诊断 + 个人化计划 | 「我该练什么」「给我个计划」 |
| `/toefl-dashboard` | 启动本地可视化面板 | 「打开 dashboard」 |

**系统特点：**
- 数据本地化存储在 `~/.toefl/`（纯 JSON + markdown，人类可读）
- Dashboard 只读本地文件，无网络请求
- 每个 skill 独立，可以单独用
- 中文交互 + 英文术语
- MIT License

---

## 安装

### 前提
- [Claude Code](https://docs.claude.com/en/docs/claude-code) 已安装
- Node.js v18+（仅 Dashboard 需要）
- `jq`（所有 skill 都用到，macOS: `brew install jq`，Linux: `apt install jq`）

### Step 1：安装 skill

```bash
git clone https://github.com/wcqqq1214/toefl-claude-skills.git
cd toefl-claude-skills

# 复制 7 个 skill 到 Claude Code 目录
cp -r toefl toefl-reading toefl-listening toefl-writing toefl-speaking \
      toefl-vocab toefl-diagnose toefl-dashboard ~/.claude/skills/
```

### Step 2：初始化数据目录

```bash
bash scripts/init.sh
```

执行完会创建 `~/.toefl/` 及其子目录。

### Step 3：（可选）装 Dashboard 依赖

```bash
cd dashboard
npm install
```

### Step 4：（可选）启用状态栏

在 `~/.claude/settings.json` 加：

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash /absolute/path/to/toefl-claude-skills/scripts/statusline.sh"
  }
}
```

重启 Claude Code，输入 `/toefl` 开始。

---

## 快速开始

### 1. 摸底（30 秒）

```
你：/toefl
AI：问 3 个问题 — 目标分 / 考试日期 / 现在水平
    自动写入 ~/.toefl/config.json
```

### 2. 练一个（30 分钟）

```
你：/toefl-writing
   [粘贴 Integrated 题目 + 你写的作文]
AI：
- ETS rubric 0-5 打分 + 估 0-30 分
- 三点对应检查
- 句子级标注每个问题
- 改写成目标分数版本
- 自动归档到 ~/.toefl/writing/
```

### 3. 看数据（1 分钟）

```bash
cd dashboard && npm run dev
# 打开 http://localhost:5173
```

看到：
- 倒计时 + 进度条
- 四科雷达图（当前 vs 目标）
- 写作趋势线
- 阅读/听力正确率
- 口语四维雷达
- 高频错题 Top 10
- 词汇 SRS 状态
- 同义替换库

### 4. 要计划（5 秒）

```
你：/toefl-diagnose
AI：分析 ~/.toefl/ 所有数据
    输出: 当前估分 / 瓶颈分析 / 今日 3 小时计划 / 里程碑预警
    自动保存到 ~/.toefl/plans/YYYY-MM-DD.md
```

---

## 架构

```
toefl-claude-skills/
├── toefl/                      # 路由 + 摸底 + config 写入
├── toefl-reading/              # 阅读批改（10 题型）
├── toefl-listening/            # 听力精听 + 错因三分诊断
├── toefl-writing/              # 写作批改（Integrated + AD）
├── toefl-speaking/             # 口语 4 Task 模板 + 批改
├── toefl-vocab/                # 词汇 SRS + 同义替换
├── toefl-diagnose/             # 数据分析 + 计划生成
├── toefl-dashboard/            # Dashboard 启动器
├── dashboard/                  # React + Vite 可视化
│   ├── src/
│   │   ├── App.jsx
│   │   ├── panels/             # 9 个面板组件
│   │   └── style.css
│   ├── vite.config.js          # 本地 API middleware
│   └── package.json
├── scripts/
│   ├── init.sh                 # 初始化 ~/.toefl/
│   ├── backup.sh               # 打 tar.gz 备份
│   ├── restore.sh              # 从备份恢复
│   └── statusline.sh           # Claude Code 状态栏
├── docs/
│   └── DATA_SCHEMA.md          # JSON schema 完整文档
├── README.md
└── LICENSE
```

### 数据流

```
用户在 Claude Code
  ↓ /toefl-writing 批改作文
skill 写入:
  ~/.toefl/writing/YYYY-MM-DD-tHH-MM-integrated.md    ← markdown 归档
  ~/.toefl/writing/index.json                         ← 索引（追加一条）
  ~/.toefl/errors/tags.json                           ← 错题标签聚合
  ↓
/toefl-diagnose 读所有 index.json + tags.json
  ↓ 分析瓶颈
  ↓ 生成计划到 ~/.toefl/plans/YYYY-MM-DD.md
  ↓
Dashboard (Vite dev server) 通过 /api/* 读同一批文件
  ↓ 渲染图表
```

所有数据见 [docs/DATA_SCHEMA.md](./docs/DATA_SCHEMA.md)。

---

## 数据备份

```bash
# 备份（保留最近 10 份）
bash scripts/backup.sh
# → ~/.toefl/backups/toefl-backup-2026-05-08-150000.tar.gz

# 恢复
bash scripts/restore.sh
# → 交互式选择
```

---

## 托福 vs 雅思：这套和雅思版的差异

这套源自同作者的 [ielts-claude-skills](https://github.com/YANZHANLIN/ielts-claude-skills) fork。核心差异：

| 维度 | 雅思版 | 托福版 |
|------|-------|--------|
| 分数 | 9 分制，四科平均取 0.5 | 120 分制，每科 0-30 直接相加 |
| 阅读题型 | T/F/NG、Matching Headings | 10 种题型，无 T/F/NG，重点是 Sentence Simplification / Insert Text / Prose Summary |
| 写作 | Task 1 图表 + Task 2 议论文 | Integrated（读+听+写）+ Academic Discussion（论坛帖）|
| 口语 | 与考官对话 | 全程录音，Task 1 独立 + Task 2-4 综合 |
| 听力 | 独立训练 | 渗透到 Writing Integrated 和 Speaking Task 2/3/4 |

---

## 已知限制

- **Dashboard 只读**：可视化不能直接操作数据，所有数据变更经 skill
- **单用户**：`~/.toefl/` 是单用户目录，不支持多账号
- **AI 评分偏高**：实战分通常比 AI 评分低 2-3 分（作文）或 0.5 rubric（口语）
- **SRS 简化实现**：Leitner 5 盒法，不是完整 SM-2 算法
- **打包的 dashboard/dist 不能用**：静态文件无法读本地 JSON，必须跑 dev server

---

## 怎么改成自己的版本

1. Fork 一份
2. 改对应的 `SKILL.md`（人格、评分标准、模板）
3. 改 `docs/DATA_SCHEMA.md` 和各 skill 的"数据持久化"段落同步 schema
4. 改 `dashboard/src/panels/*` 适配新数据
5. 重新复制到 `~/.claude/skills/`

**常见改法：**
- GRE / GMAT / SAT：改分数体系 + 题型
- 雅思：换回 9 分制 + T/F/NG 逻辑
- 单人训练 → 团队：加 `user_id` 字段到所有 JSON

---

## License

[MIT](./LICENSE)

随便用、随便改、随便商用。

---

## 反馈

Issue 或 PR。
