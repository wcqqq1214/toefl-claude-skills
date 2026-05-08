# TOEFL Claude Skills · Data Schema (v3.0)

所有持久化数据存放在 `~/.toefl/`。纯文本 + JSON，无二进制，无数据库。

**设计原则：**
- Markdown 归档（人类可读，Claude 可读） + JSON 索引（dashboard 可读）
- 每次 skill 调用 = 追加，不覆盖
- 所有文件用 UTF-8
- 日期全用 ISO 8601（`2026-05-08T14:30:00+08:00`）

---

## 目录结构

```
~/.toefl/
├── config.json                 # 用户配置
├── writing/
│   ├── index.json              # 所有作文的索引
│   └── 2026-05-08-t14-30-integrated.md   # 单篇归档
├── reading/
│   ├── index.json
│   └── 2026-05-08-t15-00-tpo42-p1.md
├── listening/
│   ├── index.json
│   └── 2026-05-08-t16-00-tpo42-l1.md
├── speaking/
│   ├── index.json
│   └── 2026-05-08-t17-00-task3.md
├── errors/
│   └── tags.json               # 所有错题按 tag 聚合
├── synonyms/
│   └── library.json            # 累积同义替换库
├── vocab/
│   └── srs.json                # 间隔重复队列
├── plans/
│   └── 2026-05-08.md           # 每日训练计划
└── backups/
    └── toefl-backup-2026-05-08.tar.gz
```

---

## `config.json`

用户配置。由 `/toefl` 第一次摸底时创建，之后可更新。

```json
{
  "target_score": 100,
  "target_breakdown": {
    "reading": 26,
    "listening": 25,
    "speaking": 23,
    "writing": 26
  },
  "exam_date": "2026-08-15",
  "current_baseline": {
    "reading": 22,
    "listening": 20,
    "speaking": 20,
    "writing": 22,
    "total": 84,
    "measured_at": "2026-05-08"
  },
  "daily_hours": 3,
  "weakest_section": "speaking",
  "notes": "准备 Top 50 硕士申请",
  "updated_at": "2026-05-08T10:00:00+08:00"
}
```

**字段说明：**
- `target_score`: 0-120
- `target_breakdown`: 四科目标（加起来应该 ≥ `target_score`，留余量）
- `exam_date`: ISO 日期，用于倒计时
- `current_baseline`: 最近一次完整模考成绩，用于对比和进度可视化
- `weakest_section`: `reading | listening | speaking | writing`，诊断 skill 写入

---

## Writing 归档

### `writing/index.json`

```json
{
  "entries": [
    {
      "id": "2026-05-08-t14-30-integrated",
      "date": "2026-05-08T14:30:00+08:00",
      "task_type": "integrated",
      "topic": "animal migration",
      "word_count": 180,
      "rubric_score": 3.5,
      "estimated_30": 22,
      "issues": ["lecture_point_2_missing", "pronoun_reference_unclear"],
      "target_score": 26,
      "file": "writing/2026-05-08-t14-30-integrated.md"
    }
  ]
}
```

**字段说明：**
- `task_type`: `integrated | academic_discussion`
- `rubric_score`: 0-5（ETS 官方 rubric）
- `estimated_30`: 单项写作 0-30 分估算
- `issues`: 标签数组，会同时写入 `errors/tags.json`

### `writing/YYYY-MM-DD-tHH-MM-{type}.md`

每次批改生成一个 md 文件。frontmatter + 内容：

```markdown
---
id: 2026-05-08-t14-30-integrated
date: 2026-05-08T14:30:00+08:00
task_type: integrated
topic: animal migration
word_count: 180
rubric_score: 3.5
estimated_30: 22
issues:
  - lecture_point_2_missing
  - pronoun_reference_unclear
---

## 题目
[原题，包括阅读段和讲座 bullet points]

## 用户作文
[原文]

## 批改报告
[Phase 1-6 完整输出]

## 改写对比
[高分版本]
```

---

## Reading 归档

### `reading/index.json`

```json
{
  "entries": [
    {
      "id": "2026-05-08-t15-00-tpo42-p1",
      "date": "2026-05-08T15:00:00+08:00",
      "source": "TPO 42 Passage 1",
      "topic": "volcanic eruptions",
      "total_questions": 10,
      "correct": 7,
      "wrong_questions": [3, 7, 9],
      "error_types": {
        "sentence_simplification": 1,
        "insert_text": 1,
        "prose_summary": 1
      },
      "time_spent_minutes": 19,
      "file": "reading/2026-05-08-t15-00-tpo42-p1.md"
    }
  ]
}
```

### `reading/YYYY-MM-DD-tHH-MM-{source}.md`

```markdown
---
id: 2026-05-08-t15-00-tpo42-p1
date: 2026-05-08T15:00:00+08:00
source: TPO 42 Passage 1
topic: volcanic eruptions
total_questions: 10
correct: 7
wrong_questions: [3, 7, 9]
error_types:
  sentence_simplification: 1
  insert_text: 1
  prose_summary: 1
synonyms:
  - topic: significant
    source: substantial
    q: 3
  - topic: decline
    source: deteriorate
    q: 5
---

## 文章
[原文]

## 错题分析
[Phase 2 逐题拆解]

## 同义替换表
[本次提取的对应]
```

---

## Listening 归档

### `listening/index.json`

```json
{
  "entries": [
    {
      "id": "2026-05-08-t16-00-tpo42-l1",
      "date": "2026-05-08T16:00:00+08:00",
      "source": "TPO 42 Lecture 1",
      "topic": "art history",
      "total_questions": 6,
      "correct": 4,
      "wrong_questions": [2, 5],
      "error_types": {
        "main_idea": 0,
        "detail": 1,
        "function": 1,
        "attitude": 0,
        "inference": 0,
        "connecting_content": 0
      },
      "missed_keywords": ["impressionism", "brushstroke"],
      "time_spent_minutes": 8,
      "file": "listening/2026-05-08-t16-00-tpo42-l1.md"
    }
  ]
}
```

**listening error types**: `main_idea | detail | function | attitude | inference | connecting_content`

---

## Speaking 归档

### `speaking/index.json`

```json
{
  "entries": [
    {
      "id": "2026-05-08-t17-00-task3",
      "date": "2026-05-08T17:00:00+08:00",
      "task": 3,
      "topic": "bystander effect",
      "duration_sec": 55,
      "word_count": 125,
      "rubric_scores": {
        "general": 3,
        "delivery": 3,
        "language": 2,
        "topic_development": 2.5
      },
      "overall_rubric": 2.5,
      "estimated_30": 20,
      "issues": ["missing_example_detail", "repeated_vocab", "long_pause"],
      "file": "speaking/2026-05-08-t17-00-task3.md"
    }
  ]
}
```

**字段说明：**
- `task`: 1 | 2 | 3 | 4
- `rubric_scores`: 四维 0-4
- `overall_rubric`: 0-4（四维综合）

---

## `errors/tags.json`

所有 skill 写入错题时，同步在此聚合。用于 diagnose + dashboard 的"高频错误"可视化。

```json
{
  "tags": {
    "sentence_simplification": {
      "count": 7,
      "sections": ["reading"],
      "last_seen": "2026-05-08T15:00:00+08:00",
      "trend_7d": [1, 2, 1, 0, 1, 1, 1],
      "entries": [
        "reading/2026-05-01-t10-00-tpo40-p2",
        "reading/2026-05-08-t15-00-tpo42-p1"
      ]
    },
    "lecture_point_2_missing": {
      "count": 3,
      "sections": ["writing"],
      "last_seen": "2026-05-08T14:30:00+08:00",
      "trend_7d": [0, 1, 0, 0, 1, 0, 1],
      "entries": ["writing/2026-05-08-t14-30-integrated"]
    }
  },
  "updated_at": "2026-05-08T15:00:00+08:00"
}
```

**标签命名规范：** snake_case，描述性。例如：
- Reading: `sentence_simplification | insert_text | prose_summary_detail_trap | negative_factual | vocabulary_context`
- Listening: `main_idea | detail | function | attitude | inference | connecting_content`
- Writing: `lecture_point_N_missing | no_specific_example | word_count_low | template_detected | personal_opinion_in_integrated`
- Speaking: `missing_example_detail | repeated_vocab | long_pause | timing_under_40s | task_incomplete`

---

## `synonyms/library.json`

累积的同义替换库。每次 reading / writing 批改都可能追加。

```json
{
  "entries": [
    {
      "topic_word": "significant",
      "source_word": "substantial",
      "context": "a significant increase → a substantial rise",
      "section": "reading",
      "first_seen": "2026-04-20",
      "last_seen": "2026-05-08",
      "count": 3
    }
  ],
  "updated_at": "2026-05-08T15:00:00+08:00"
}
```

去重键：`(topic_word, source_word)`，重复出现则 `count++` 且更新 `last_seen`。

---

## `vocab/srs.json`

间隔重复队列。`/toefl-vocab` 使用 SM-2 简化版。

```json
{
  "queue": [
    {
      "word": "exacerbate",
      "translation": "加剧、恶化",
      "synonym": "worsen, aggravate",
      "example": "The drought exacerbated food shortages.",
      "box": 3,
      "next_review": "2026-05-11",
      "added_at": "2026-05-01",
      "reviews": [
        {"date": "2026-05-01", "result": "new"},
        {"date": "2026-05-03", "result": "correct"},
        {"date": "2026-05-08", "result": "correct"}
      ]
    }
  ],
  "updated_at": "2026-05-08T15:00:00+08:00"
}
```

**Box 规则（简化 Leitner）：**
- Box 1 → 1 天后
- Box 2 → 3 天后
- Box 3 → 7 天后
- Box 4 → 14 天后
- Box 5 → 30 天后（毕业）

答对 → 升一级；答错 → 降到 Box 1。

---

## `plans/YYYY-MM-DD.md`

`/toefl-diagnose` 生成的每日训练计划。

```markdown
---
date: 2026-05-08
based_on_baseline: 2026-05-06
target_score: 100
days_until_exam: 99
focus_section: speaking
---

## 今日计划（3 小时）

### 优先级 1：口语 Task 3（40 分钟）
- 理由：Speaking 20 离目标 23 还差 3 分，Task 3 是 4 个中最弱的
- 做：TPO 45-50 的 Task 3 各录一遍 → 发到 `/toefl-speaking` 批改

### 优先级 2：听力精听（60 分钟）
- 理由：Listening 20 离目标 25 还差 5 分，听力是口语和写作的底层能力
- 做：TPO 50 Lecture 1 精听 → 错题发到 `/toefl-listening`

### 优先级 3：阅读专项（40 分钟）
- 理由：高频错题标签 `sentence_simplification` 本周出现 4 次
- 做：专项练 Sentence Simplification 10 题

### 优先级 4：词汇 SRS（20 分钟）
- 今日应复习：{x} 个词
- 去 `/toefl-vocab`

## 本周进度
- 已完成任务：{x}/20
- 最近一次模考：84（2026-05-06）
- 距离目标：-16
```

---

## 文件写入约定

所有 skill 通过 Bash heredoc 写入。

**写入索引（追加一条）：**
```bash
jq '.entries += [$new]' ~/.toefl/writing/index.json \
  --argjson new '{"id": "...", "date": "...", ...}' \
  > ~/.toefl/writing/index.json.tmp \
  && mv ~/.toefl/writing/index.json.tmp ~/.toefl/writing/index.json
```

**更新 tags.json（count + trend）：**
由 `/toefl-diagnose` 定期重算，或 skill 调用时增量更新。

**所有 skill 在启动时自动执行：**
```bash
mkdir -p ~/.toefl/{writing,reading,listening,speaking,errors,synonyms,vocab,plans,backups}
[ ! -f ~/.toefl/writing/index.json ] && echo '{"entries":[]}' > ~/.toefl/writing/index.json
# ... 其他初始化
```

一个初始化脚本会放在 `scripts/init.sh`，由各 skill 首次调用。

---

## 版本演进

本 schema 版本：**v3.0**

未来如需破坏性变更，会在 `~/.toefl/config.json` 加 `schema_version` 字段，配 `scripts/migrate.sh`。
