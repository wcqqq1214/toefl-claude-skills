# TOEFL 2026 Skills

> 一套可在 Codex App 使用的 TOEFL iBT 2026 备考 skill 系统。
> 主分制为 1-6 band，兼容过渡期的旧 0-120 参考分。

---

## 这是什么

7 个 Codex/Claude-style skill + 1 个本地 dashboard + 脚本工具链：

| Skill | 作用 | 触发词 |
|-------|------|--------|
| `/toefl` | 入口、摸底、路由、写入 config | TOEFL、我要备考托福 |
| `/toefl-reading` | 2026 阅读：Complete the Words / Daily Life / Academic Passage | 阅读错题、Complete the Words |
| `/toefl-listening` | 2026 听力：短回应、对话、公告、Academic Talk | 听力错题、精听 |
| `/toefl-writing` | 2026 写作：Build a Sentence / Email / Academic Discussion | 批改写作、邮件、论坛帖 |
| `/toefl-speaking` | 2026 口语：Listen and Repeat / Take an Interview | 口语批改、Interview |
| `/toefl-vocab` | SRS 词汇、Complete the Words、同义替换 | 背单词、同义替换 |
| `/toefl-diagnose` | 读取 `~/.toefl/`，生成 1-6 band 诊断和计划 | 我该练什么、给我计划 |

Dashboard 读取本地 `~/.toefl/`，不发网络请求。

---

## TOEFL 2026 适配

当前规则快照：

- 2026 年 1 月 21 日起，TOEFL iBT 成绩报告使用 1-6 scale，0.5 递增。
- Reading、Listening、Speaking、Writing 四科都有 1-6 section score。
- Overall score 是四科平均后取最近 0.5 band。
- 过渡期内成绩单会同时给可比 0-120 总分参考。
- Reading/Listening 是两阶段自适应；练习正确率不能精确换算正式分。
- Writing 任务为 Build a Sentence、Write an Email、Write for an Academic Discussion。
- Speaking 任务为 Listen and Repeat、Take an Interview。

官方参考：

- [ETS score guidance](https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html)
- [ETS test content](https://www.ets.org/toefl/test-takers/ibt/about/content.html)
- [ETS reading section](https://www.ets.org/toefl/test-takers/ibt/about/content/reading.html)
- [ETS listening section](https://www.ets.org/toefl/test-takers/ibt/about/content/listening.html)
- [ETS writing section](https://www.ets.org/toefl/test-takers/ibt/about/content/writing.html)
- [ETS speaking section](https://www.ets.org/toefl/test-takers/ibt/about/content/speaking.html)

---

## 安装到 Codex App

```bash
git clone https://github.com/wcqqq1214/toefl-claude-skills.git
cd toefl-claude-skills

mkdir -p ~/.codex/skills
cp -R toefl toefl-reading toefl-listening toefl-writing toefl-speaking \
      toefl-vocab toefl-diagnose ~/.codex/skills/
```

重启 Codex App 后，直接输入 `/toefl` 或显式说 `Use $toefl`。

如果还要给 Claude Code 使用：

```bash
mkdir -p ~/.claude/skills
cp -R toefl toefl-reading toefl-listening toefl-writing toefl-speaking \
      toefl-vocab toefl-diagnose ~/.claude/skills/
```

---

## 初始化数据

```bash
bash scripts/init.sh
```

会创建：

```text
~/.toefl/
├── config.json
├── writing/
├── reading/
├── listening/
├── speaking/
├── errors/
├── synonyms/
├── vocab/
├── plans/
└── backups/
```

首次 `/toefl` 会写入 `schema_version: "2026-1-6"` 的配置。

---

## Dashboard

```bash
cd dashboard
npm install
cd ..
bash scripts/dashboard.sh
```

打开 [http://localhost:5173](http://localhost:5173)。

Dashboard 显示：

- 目标 band / 当前 band / 倒计时
- 四科 1-6 雷达
- 写作 practice band 趋势
- 阅读/听力练习正确率
- 口语维度雷达
- 高频错因
- 词汇 SRS
- 同义替换库

---

## 数据模型

见 [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md)。

核心字段：

- `target_score`: 1-6 band
- `target_breakdown`: 四科 1-6 band
- `section_band`: 正式或完整模考 section band
- `estimated_band`: 练习估计 band
- `legacy_total_120` / `estimated_30`: 旧分制兼容字段

---

## 重要限制

- AI 批改会偏乐观，练习 `estimated_band` 不能当正式分。
- Reading/Listening 的自适应算法不公开，练习正确率只用于趋势。
- 旧 TPO 材料仍可训练基础能力，但不能当作 2026 正式题型结构。
- 具体考试要求以学校和 ETS 最新页面为准。

---

## 开发

```bash
# 校验 skill frontmatter
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py toefl

# Dashboard
cd dashboard
npm run build
```

License: MIT
