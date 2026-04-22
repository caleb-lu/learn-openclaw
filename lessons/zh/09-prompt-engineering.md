# Prompt 工程

OpenClaw 采用独特的 8 层 Prompt 架构来组装最终发送给 LLM 的完整 Prompt。理解每一层的作用和顺序，是优化助手行为、提升回复质量的关键。本节课将逐层解析这个 Prompt 系统的设计与使用。

## 学习目标

- 理解 OpenClaw 8 层 Prompt 架构的完整结构
- 掌握每一层 Prompt 的作用与配置方式
- 了解层序对最终输出的影响
- 学会通过优化各层 Prompt 提升助手表现
- 能够排查 Prompt 相关的问题

## 前置知识

- 了解 LLM 的 System Prompt / User Prompt 基本概念
- 已配置工作空间和 SOUL.md（第 03 节）
- 理解 Agent 配置（第 08 节）

## 8 层 Prompt 架构

OpenClaw 在每次请求时，会按以下顺序组装 8 层 Prompt：

```
┌──────────────────────────────────────────┐
│  第 1 层：Core System（核心系统指令）       │  ← 框架内置，不可编辑
├──────────────────────────────────────────┤
│  第 2 层：Agent Identity（Agent 身份）     │  ← IDENTITY.md
├──────────────────────────────────────────┤
│  第 3 层：SOUL（人格定义）                 │  ← SOUL.md
├──────────────────────────────────────────┤
│  第 4 层：Tool Definitions（工具定义）     │  ← TOOLS.md
├──────────────────────────────────────────┤
│  第 5 层：Memory Context（记忆上下文）     │  ← MEMORY.md 召回
├──────────────────────────────────────────┤
│  第 6 层：Skill Instructions（技能指令）   │  ← SKILL.md 激活的技能
├──────────────────────────────────────────┤
│  第 7 层：Conversation History（对话历史） │  ← 当前会话消息
├──────────────────────────────────────────┤
│  第 8 层：User Message（用户消息）         │  ← 当前输入
└──────────────────────────────────────────┘
```

## 各层详解

### 第 1 层：Core System

由 OpenClaw 框架自动注入，用户不可编辑。包含：

- 输出格式要求（JSON / Markdown）
- 安全约束与边界
- 工具调用的格式规范
- 时间感知（当前日期时间）

```
[System Core]
Current time: 2025-01-15 14:30:00 CST
Output format: markdown
Safety constraints: enabled
Tool call format: <tool name="..." params="...">...</tool>
```

### 第 2 层：Agent Identity

来自 IDENTITY.md，定义助手的基本身份信息。

```markdown
[Identity]
名称：小爪
角色：个人全能 AI 助手
语言：简体中文 / English
```

### 第 3 层：SOUL

来自 SOUL.md，定义性格和行为准则。这是对助手行为影响最大的一层。

```markdown
[Personality]
你是一个温暖、幽默且富有耐心的 AI 助手...
（SOUL.md 的完整内容）
```

### 第 4 层：Tool Definitions

来自 TOOLS.md 和已安装技能的工具声明，告诉 LLM 它可以使用哪些工具。

```markdown
[Available Tools]
1. web_search(query: string) → 搜索互联网
2. code_exec(language: string, code: string) → 执行代码
3. weather(city: string) → 查询天气
```

### 第 5 层：Memory Context

从 MEMORY.md 中自动召回的相关记忆条目。

```markdown
[Memory Context]
- 用户偏好使用 Python 进行数据分析
- 用户上次讨论了 FastAPI 项目架构
- 用户的时区是 Asia/Shanghai
```

### 第 6 层：Skill Instructions

当前激活的技能提供的额外指令。

```markdown
[Active Skills: code-review]
当用户请求代码审查时：
1. 检查代码风格和命名规范
2. 分析潜在的 bug 和安全问题
3. 评估性能和可维护性
4. 给出改进建议
```

### 第 7 层：Conversation History

当前会话的历史消息，包含角色标记。

```
[user] 帮我写一个快速排序
[assistant] 当然！以下是 Python 实现...
[user] 能加上注释吗？
```

### 第 8 层：User Message

用户当前发送的消息。

```
帮我把这个函数改成迭代版本
```

## 层序影响分析

层序决定了信息的优先级。靠近 LLM 输入末尾的内容（高层）往往有更高的注意力权重：

| 层 | 位置 | 影响程度 | 说明 |
|----|------|----------|------|
| 第 1 层 | 最前面 | 低 | 框架级约束，容易被覆盖 |
| 第 2-3 层 | 前部 | 中 | 身份和人格，影响整体风格 |
| 第 4-6 层 | 中部 | 中高 | 工具和记忆，影响行为能力 |
| 第 7-8 层 | 末部 | 高 | 对话历史和当前输入，直接影响回复 |

## Prompt 调试与查看

```bash
# 查看完整组装后的 Prompt（不含对话历史）
openclaw prompt preview

# 查看带对话历史的完整 Prompt
openclaw prompt preview --with-history --session <session-id>

# 查看特定层的内容
openclaw prompt show --layer soul
openclaw prompt show --layer memory

# 统计 Prompt 的 Token 使用情况
openclaw prompt stats
# 输出：
# Layer 1 (Core):      120 tokens
# Layer 2 (Identity):   85 tokens
# Layer 3 (SOUL):      340 tokens
# Layer 4 (Tools):     210 tokens
# Layer 5 (Memory):    180 tokens
# Layer 6 (Skills):    150 tokens
# Layer 7 (History):   890 tokens
# Total system:       1975 tokens
```

## 优化建议

1. **SOUL.md 控制在 500 字以内**：过长会占用 Token 预算，降低对用户消息的关注度
2. **记忆召回限制条数**：建议每次召回 3-5 条最相关的记忆
3. **工具描述简洁精确**：每个工具描述控制在 2-3 行
4. **定期审查 Token 使用**：使用 `prompt stats` 监控各层占用
5. **对话历史适时截断**：设置合理的 `contextWindow` 避免超限

## 小结

本节课解析了 OpenClaw 的 8 层 Prompt 架构。从核心系统指令到用户消息，每一层都有明确的职责。理解层序的影响可以帮助你更有效地优化助手的表现——重要指令放在高层，基础设定放在低层。下一节课我们将学习记忆系统的配置与管理。
