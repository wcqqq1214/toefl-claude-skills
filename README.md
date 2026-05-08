# TOEFL Claude Skills · v1.0

> 一套跑在 Claude Code 上的托福备考 AI 教练 skill。
> **无状态、零依赖、纯文本提示词。** 装上就能用。

---

## 这是什么

4 个 [Claude Code Skill](https://docs.claude.com/en/docs/claude-code/skills)，构成一个最小可用的托福备考助手：

| Skill | 干啥 | 触发词 |
|-------|------|--------|
| `/toefl` | 路由入口 + 摸底 + 给建议 | 「我要备考托福」「TOEFL」 |
| `/toefl-reading` | 10 种题型拆解 + 同义替换 + 错题诊断（含 Sentence Simplification / Insert Text / Prose Summary 专项）| 「分析阅读」「这道为什么错」 |
| `/toefl-writing` | Integrated 综合写作批改 + Academic Discussion 批改 + 审题 | 「批改作文」「综合写作」「论坛帖」 |
| `/toefl-speaking` | 4 个 Task 模板 + 笔记框架 + 时间分配 + 答案批改 | 「口语模板」「Task 3 准备」「综合口语」 |

**特点：**
- 完全无状态——不写任何本地文件，每次对话独立
- 无依赖——纯 markdown 提示词，无 npm、无 Python、无数据库
- 中文交互 + 英文术语
- MIT License，随便改

---

## 适合谁

- 备考托福、想用 AI 当陪练的考生（特别是目标 100+）
- 已经在用 Claude Code 的开发者
- 想看看托福 skill 怎么写的人（拿去改成自己的版本）

---

## 安装

### 前提
你要先装好 [Claude Code](https://docs.claude.com/en/docs/claude-code)。

### 方法一：直接复制

```bash
# Mac / Linux
cp -r toefl toefl-writing toefl-reading toefl-speaking ~/.claude/skills/
```

```powershell
# Windows PowerShell
Copy-Item -Recurse toefl, toefl-writing, toefl-reading, toefl-speaking $env:USERPROFILE\.claude\skills\
```

### 方法二：克隆

```bash
git clone https://github.com/wcqqq1214/toefl-claude-skills.git
cd toefl-claude-skills
cp -r toefl toefl-writing toefl-reading toefl-speaking ~/.claude/skills/
```

装完之后重启 Claude Code，输入 `/toefl` 就能用。

---

## 怎么用

### 场景 1：什么都不知道，想被引导

```
你：/toefl
AI：（问你 3 个问题：目标分数、考试日期、今天想练啥）
   → 路由到对应的子 skill
```

### 场景 2：直接批改作文

```
你：/toefl-writing
   [粘贴题目（阅读段 + 讲座要点，或论坛题 + 同学回复）+ 你的作文]
AI：
- ETS rubric 0-5 打分 + 估算 0-30 分
- 三点对应检查（Integrated）/ 维度拆分（Academic Discussion）
- 句子级标注每个问题
- 改写成目标分数版本
- 给提分优先级
```

### 场景 3：分析阅读错题

```
你：/toefl-reading
   [粘贴文章 + 题目 + 你的答案 + 标准答案]
AI：
- 按 10 种题型分类
- 逐题拆解错因（Sentence Simplification / Insert Text / Prose Summary 等有专项逻辑）
- 提取同义替换词表
- 错因总结 + 下一步建议
```

### 场景 4：准备口语任务

```
你：/toefl-speaking
   "帮我准备 Task 3 的答题模板" / "批改我的 Task 2 录音转文字"
AI：
- 秒级时间分配（15/30 秒准备 → 45/60 秒作答）
- 笔记模板（综合题必须）
- 填空式答题框架
- 改写对比 + 四维 rubric 打分
```

---

## 文件结构

```
toefl-claude-skills/
├── toefl/SKILL.md              # 路由教练
├── toefl-writing/SKILL.md      # 写作批改（Integrated + Academic Discussion）
├── toefl-reading/SKILL.md      # 阅读分析（10 种题型）
├── toefl-speaking/SKILL.md     # 口语 4 个 Task
├── README.md                   # 你正在看
└── LICENSE                     # MIT
```

每个 skill 就是一个文件夹 + 一个 `SKILL.md`。Claude Code 通过 `name` 字段识别和触发。

---

## 托福 vs 雅思：改这套 skill 时要注意什么

这套基于同作者的 [ielts-claude-skills](https://github.com/YANZHANLIN/ielts-claude-skills) 改写。如果你熟悉雅思版，以下差异要注意：

| 维度 | 雅思版 | 托福版（这里） |
|------|-------|-------------|
| 分数 | 9 分制，四科平均取 0.5 | 120 分制，每科 0-30 直接相加 |
| 阅读题型 | T/F/NG、Matching Headings | 10 种题型，无 T/F/NG，重点是 Sentence Simplification / Insert Text / Prose Summary |
| 写作 | Task 1 图表 + Task 2 议论文 | Integrated（读+听+写）+ Academic Discussion（论坛帖） |
| 口语 | 与考官对话，Part 1/2/3 | 全程录音，Task 1 独立 + Task 2-4 综合（读+听+说） |
| 听力 | 独立训练 | 渗透到 Writing Task 1 和 Speaking Task 2/3/4 |

---

## 怎么改成自己的版本

1. Fork 一份
2. 改对应的 `SKILL.md`——人格、评分标准、模板都在里面
3. 重新复制到 `~/.claude/skills/`
4. 重启 Claude Code

**常见改法：**
- 改 SOUL 段落 → 换教练人格
- 改评分表 → 适配 GRE / GMAT / SAT / 专四专八
- 改模式表 → 加新的工作流
- 改边界段 → 调整 skill 之间的分工

---

## 已知限制（v1.0）

- **无状态**：每次对话独立，不保留批改历史 / 错题本
- **无进度追踪**：没有跨会话的分数趋势
- **无听力 skill**：听力建议直接用 TPO + 精听 + 影子跟读，AI 价值较低
- **AI 评分偏高**：实战分通常比 AI 评分低 2-3 分（作文）或 0.5 rubric（口语）——交叉验证

---

## License

[MIT](./LICENSE)

随便用、随便改、随便商用。注明出处不强制但欢迎。

---

## 反馈

发 issue 或者 PR。
