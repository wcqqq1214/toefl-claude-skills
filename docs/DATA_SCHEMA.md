# TOEFL 2026 Skills - Data Schema

所有持久化数据存放在 `~/.toefl/`。JSON 索引用于 dashboard，Markdown 归档用于人类和 AI 复盘。

## 设计原则

- 当前主分制是 TOEFL iBT 2026 的 `1-6` band，0.5 递增。
- 旧 `0-120` 总分和 `0-30` 单科分只保存在 `legacy_*` 字段。
- 练习估分写 `estimated_band`，正式/模考分写 `section_band`。
- Reading/Listening 的自适应正式算法不公开，正确率只能生成 practice estimate。
- 所有写入追加，不覆盖历史记录。

---

## 目录结构

```text
~/.toefl/
├── config.json
├── writing/
│   ├── index.json
│   └── 2026-07-06-t10-00-email.md
├── reading/
│   ├── index.json
│   └── 2026-07-06-t10-30-reading.md
├── listening/
│   ├── index.json
│   └── 2026-07-06-t11-00-listening.md
├── speaking/
│   ├── index.json
│   └── 2026-07-06-t11-30-interview.md
├── errors/
│   └── tags.json
├── synonyms/
│   └── library.json
├── vocab/
│   └── srs.json
├── plans/
│   └── 2026-07-06.md
└── backups/
```

---

## `config.json`

```json
{
  "schema_version": "2026-1-6",
  "score_scale": "1-6",
  "target_score": 5.0,
  "target_breakdown": {
    "reading": 5.0,
    "listening": 5.0,
    "speaking": 4.5,
    "writing": 5.0
  },
  "exam_date": "2026-08-15",
  "current_baseline": {
    "reading": 4.5,
    "listening": 4.0,
    "speaking": 4.0,
    "writing": 4.5,
    "total": 4.5,
    "legacy_total_120": 90,
    "measured_at": "2026-07-06"
  },
  "daily_hours": 3,
  "weakest_section": "listening",
  "notes": "Top 50 graduate application",
  "updated_at": "2026-07-06T10:00:00+08:00"
}
```

字段：

- `target_score`: 1-6 band。
- `target_breakdown`: 四科目标 band。
- `current_baseline`: 最近一次正式成绩、模考或可靠估计。旧分放 `legacy_total_120`。
- `weakest_section`: `reading | listening | speaking | writing`。

---

## Writing

`writing/index.json`:

```json
{
  "entries": [
    {
      "id": "2026-07-06-t10-00-email",
      "date": "2026-07-06T10:00:00+08:00",
      "task_type": "email",
      "topic": "requesting an appointment",
      "word_count": 118,
      "raw_score": null,
      "raw_total": null,
      "rubric_score": 4,
      "estimated_band": 5.0,
      "issues": ["wrong_register", "missing_bullet"],
      "file": "writing/2026-07-06-t10-00-email.md"
    }
  ]
}
```

`task_type`:

- `build_sentence`
- `email`
- `academic_discussion`
- `section_mock`
- `legacy_integrated`

字段：

- `raw_score` / `raw_total`: Build a Sentence 或完整 section mock 的客观题记录。
- `rubric_score`: Email / Academic Discussion 的 0-5 task score。
- `estimated_band`: 1-6 practice estimate。
- `section_band`: 如来自正式/完整模考，可使用此字段。

---

## Reading

`reading/index.json`:

```json
{
  "entries": [
    {
      "id": "2026-07-06-t10-30-reading",
      "date": "2026-07-06T10:30:00+08:00",
      "source": "router practice set 1",
      "topic": "mixed",
      "total_questions": 20,
      "correct": 15,
      "estimated_band": 4.5,
      "section_band": null,
      "wrong_questions": [3, 8, 11, 14, 19],
      "task_types": {
        "complete_words": 10,
        "daily_life": 4,
        "academic_passage": 6
      },
      "error_types": {
        "vocabulary_context": 2,
        "detail_lookup": 1,
        "inference": 2
      },
      "time_spent_minutes": 28,
      "file": "reading/2026-07-06-t10-30-reading.md"
    }
  ]
}
```

`task_types`: `complete_words | daily_life | academic_passage`。

`error_types`: `vocabulary_context | detail_lookup | main_purpose | inference | reference_cohesion | paraphrase_missed | trap_choice`。

---

## Listening

`listening/index.json`:

```json
{
  "entries": [
    {
      "id": "2026-07-06-t11-00-listening",
      "date": "2026-07-06T11:00:00+08:00",
      "source": "router practice set 1",
      "topic": "mixed campus and academic",
      "total_questions": 18,
      "correct": 12,
      "estimated_band": 4.0,
      "section_band": null,
      "wrong_questions": [2, 5, 7, 12, 13, 18],
      "task_types": {
        "choose_response": 8,
        "conversation": 4,
        "announcement": 3,
        "academic_talk": 3
      },
      "error_types": {
        "sound_decoding": 2,
        "detail": 2,
        "function_intent": 1,
        "organization": 1
      },
      "missed_keywords": ["deadline", "registration"],
      "file": "listening/2026-07-06-t11-00-listening.md"
    }
  ]
}
```

`task_types`: `choose_response | conversation | announcement | academic_talk`。

`error_types`: `sound_decoding | vocabulary_phrase | gist_purpose | detail | function_intent | attitude | inference | organization`。

---

## Speaking

`speaking/index.json`:

```json
{
  "entries": [
    {
      "id": "2026-07-06-t11-30-interview",
      "date": "2026-07-06T11:30:00+08:00",
      "task_type": "interview",
      "topic": "choosing a campus activity",
      "duration_sec": 38,
      "word_count": 82,
      "dimension_scores": {
        "relevance": 5,
        "elaboration": 4,
        "fluency": 4,
        "language_use": 4,
        "intelligibility": 5
      },
      "estimated_band": 4.5,
      "issues": ["thin_elaboration", "long_pause"],
      "file": "speaking/2026-07-06-t11-30-interview.md"
    }
  ]
}
```

`task_type`: `listen_repeat | interview | section_mock | legacy_task`。

`dimension_scores`: 1-6 practice scores. Legacy entries may still contain `rubric_scores` and `overall_rubric`; dashboard should treat those as fallback only.

---

## Errors

`errors/tags.json`:

```json
{
  "tags": {
    "vocabulary_context": {
      "count": 7,
      "sections": ["reading"],
      "last_seen": "2026-07-06T10:30:00+08:00",
      "entries": ["reading/2026-07-06-t10-30-reading"]
    },
    "thin_elaboration": {
      "count": 3,
      "sections": ["speaking", "writing"],
      "last_seen": "2026-07-06T11:30:00+08:00",
      "entries": ["speaking/2026-07-06-t11-30-interview"]
    }
  },
  "updated_at": "2026-07-06T11:30:00+08:00"
}
```

标签必须使用 snake_case。

---

## Synonyms

`synonyms/library.json`:

```json
{
  "entries": [
    {
      "topic_word": "deadline",
      "source_word": "due date",
      "context": "the deadline for registration -> the registration due date",
      "section": "reading",
      "first_seen": "2026-07-06",
      "last_seen": "2026-07-06",
      "count": 2
    }
  ],
  "updated_at": "2026-07-06T11:30:00+08:00"
}
```

---

## Vocab SRS

`vocab/srs.json`:

```json
{
  "queue": [
    {
      "word": "deadline",
      "translation": "截止日期",
      "synonym": "due date",
      "example": "The deadline for registration is Friday.",
      "box": 2,
      "next_review": "2026-07-09",
      "added_at": "2026-07-06",
      "reviews": [
        {"date": "2026-07-06", "result": "new"}
      ]
    }
  ],
  "updated_at": "2026-07-06T11:30:00+08:00"
}
```

Leitner intervals:

- Box 1: 1 day
- Box 2: 3 days
- Box 3: 7 days
- Box 4: 14 days
- Box 5: 30 days

---

## Plans

`plans/YYYY-MM-DD.md`:

```markdown
---
date: 2026-07-06
score_scale: 1-6
target_score: 5.0
estimated_score: 4.5
focus_section: listening
---

# TOEFL 2026 诊断报告

...
```

---

## Legacy Compatibility

Old entries may still include:

- `estimated_30`
- `overall_rubric`
- `rubric_scores`
- `task`
- `integrated`
- `target_score` greater than 6

Consumers should:

1. Prefer `section_band`.
2. Then prefer `estimated_band`.
3. Then map legacy 0-30/0-120 fields to 1-6 for display only.
4. Never rewrite old files unless the user explicitly asks for migration.
