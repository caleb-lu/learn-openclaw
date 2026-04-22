# 记忆系统

OpenClaw 内置了持久化记忆系统，让 AI 助手能够"记住"过去的对话和重要信息。通过 MEMORY.md 文件和自动召回机制，助手可以在不同会话之间保持记忆的连续性。本节课将详细介绍记忆系统的架构与使用。

## 学习目标

- 理解 OpenClaw 记忆系统的架构设计
- 掌握 MEMORY.md 的数据格式与组织方式
- 学会配置每日记忆自动摘要
- 了解自动召回机制的工作原理
- 能够优化记忆效果，提升助手个性化体验

## 前置知识

- 已完成工作空间配置（第 03 节）
- 了解 Prompt 架构中记忆层的角色（第 09 节）
- 熟悉 Markdown 语法

## 记忆系统架构

```
对话消息
    │
    ▼
┌─────────────────┐
│  记忆提取引擎    │  ← 自动从对话中提取关键信息
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  记忆存储        │  → MEMORY.md（长期记忆）
│                 │  → 日期索引文件（每日摘要）
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  记忆召回引擎    │  ← 根据当前对话自动检索相关记忆
└────────┬────────┘
         │
         ▼
   注入 Prompt 第 5 层
```

## MEMORY.md 格式

MEMORY.md 是记忆系统的核心文件，存储在 `workspace/MEMORY.md`：

```markdown
# MEMORY.md

## 用户偏好
- 主要编程语言：Python、TypeScript
- 代码风格偏好：简洁、注重可读性
- 喜欢用类比理解复杂概念

## 项目信息
- 当前项目：OpenClaw 个人助手
- 技术栈：Node.js、Docker、WebSocket
- 项目状态：开发中

## 重要事实
- 用户时区：Asia/Shanghai (UTC+8)
- 工作时间：周一至周五 09:00-18:00
- 偏好回复语言：简体中文

## 对话摘要
### 2025-01-15
- 讨论了 OpenClaw 的安装和配置
- 配置了 Telegram 渠道
- 创建了编程助手 Agent

### 2025-01-14
- 初次安装 OpenClaw
- 测试了基础对话功能

## 关键决策
- [2025-01-15] 选择 GPT-4o 作为主模型
- [2025-01-15] 决定使用 Docker 部署方式
```

## 记忆配置

在配置文件中调整记忆系统行为：

```json5
{
  "memory": {
    "enabled": true,

    // 存储配置
    "storage": {
      "type": "file",               // file | database
      "path": "workspace/MEMORY.md",
      "maxEntries": 500,            // 最大记忆条数
      "maxFileSize": "100kb"
    },

    // 提取配置
    "extraction": {
      "autoExtract": true,           // 自动从对话中提取记忆
      "extractOnEnd": true,          // 对话结束时提取
      "confidence": 0.7,             // 提取置信度阈值
      "categories": [                // 记忆分类
        "preference",
        "fact",
        "project",
        "decision",
        "summary"
      ]
    },

    // 召回配置
    "recall": {
      "autoRecall": true,            // 自动召回相关记忆
      "maxRecallEntries": 5,         // 每次最多召回条数
      "similarityThreshold": 0.6,    // 相似度阈值
      "recencyBoost": 0.2            // 时效性加权
    },

    // 每日摘要
    "dailySummary": {
      "enabled": true,
      "time": "23:00",               // 每日摘要生成时间
      "timezone": "Asia/Shanghai",
      "maxSummaries": 30             // 保留最近 30 天摘要
    }
  }
}
```

## 手动管理记忆

```bash
# 查看当前记忆
openclaw memory list

# 搜索记忆
openclaw memory search "Python"

# 添加记忆
openclaw memory add --category preference --text "用户喜欢用 VS Code"

# 删除记忆
openclaw memory delete <memory-id>

# 导出记忆
openclaw memory export --format json

# 查看记忆统计
openclaw memory stats
```

## 每日记忆自动摘要

OpenClaw 会在每天指定时间自动生成对话摘要：

```bash
# 手动触发每日摘要
openclaw memory daily-summary

# 查看最近的每日摘要
openclaw memory summary --last 7

# 编辑摘要生成规则
openclaw config set memory.dailySummary.prompt "请用 3-5 个要点总结今天的对话"
```

每日摘要存储在 `workspace/memory/daily/` 目录下：

```
workspace/memory/
├── daily/
│   ├── 2025-01-15.md
│   ├── 2025-01-14.md
│   └── 2025-01-13.md
└── MEMORY.md
```

## 自动召回机制

当用户发送消息时，召回引擎会：

1. 对用户消息进行向量化
2. 与所有记忆条目计算相似度
3. 结合时效性加权排序
4. 选取 Top-K 条记忆注入 Prompt

```bash
# 测试记忆召回效果
openclaw memory recall --query "上次我们讨论了什么项目"
# 输出：
# 1. [similarity: 0.92, recency: 0.8] 当前项目：OpenClaw 个人助手
# 2. [similarity: 0.85, recency: 0.7] 技术栈：Node.js、Docker、WebSocket
# 3. [similarity: 0.78, recency: 0.6] 项目状态：开发中
```

## 记忆优化技巧

1. **定期清理过时记忆**：使用 `openclaw memory prune --older-than 90d`
2. **手动标记重要记忆**：添加 `priority: high` 标签
3. **控制记忆总量**：设置合理的 `maxEntries`，避免 Token 浪费
4. **分类管理**：使用 category 字段组织记忆，便于检索和清理
5. **多 Agent 隔离**：不同 Agent 使用不同的 memory namespace

## 小结

本节课介绍了 OpenClaw 记忆系统的完整架构。MEMORY.md 作为长期记忆的载体，配合自动提取、每日摘要和智能召回机制，让 AI 助手能够保持跨会话的记忆连续性。合理的记忆管理是提升助手个性化体验的关键。下一节课我们将学习技能安装与 ClawHub。
