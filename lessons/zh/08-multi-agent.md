# 多 Agent

OpenClaw 支持同时运行多个 Agent，每个 Agent 拥有独立的人格、技能和专业领域。通过多 Agent 系统，你可以让不同的 AI 助手各司其职——工作助手处理邮件和日程，生活助手管理购物和提醒，编程助手辅助开发。本节课将详解多 Agent 的配置与协作机制。

## 学习目标

- 理解多 Agent 架构的设计理念
- 掌握 Agent 的定义与配置方法
- 学会为不同 Agent 设置独立人格和工具
- 了解 Agent 之间的协作与转发机制
- 能够构建完整的多 Agent 工作流

## 前置知识

- 已完成路由规则的学习（第 07 节）
- 理解 SOUL.md 人格文件的作用（第 03 节）
- 了解 JSON5 配置格式

## 多 Agent 架构概览

```
用户消息
    │
    ▼
┌─────────────┐
│  路由引擎    │ ← 根据规则选择 Agent
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 工作助手     │ │ 生活助手     │ │ 编程助手     │
│ (work)      │ │ (life)      │ │ (coder)     │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ SOUL: 正式   │ │ SOUL: 休闲   │ │ SOUL: 技术   │
│ Tools: 邮件  │ │ Tools: 天气  │ │ Tools: 代码  │
│ Memory: 工作 │ │ Memory: 生活 │ │ Memory: 代码  │
└─────────────┘ └─────────────┘ └─────────────┘
       │              │              │
       └──────────────┴──────────────┘
                      │
                      ▼
              共享 LLM Provider
```

## Agent 配置

### 方式一：在 openclaw.json5 中配置

```json5
{
  "agents": {
    "work": {
      "name": "工作助手",
      "model": "gpt-4o",
      "temperature": 0.3,              // 更精确的回答
      "soulFile": "workspace/agents/work-soul.md",
      "identityFile": "workspace/agents/work-identity.md",
      "tools": ["email", "calendar", "todo"],
      "memory": {
        "namespace": "work",            // 独立的记忆命名空间
        "autoRecall": true
      },
      "systemPrompt": "你是工作助手，专注于邮件管理和日程安排。"
    },

    "life": {
      "name": "生活助手",
      "model": "gpt-4o-mini",          // 日常对话用轻量模型
      "temperature": 0.7,              // 更有创意的回答
      "soulFile": "workspace/agents/life-soul.md",
      "tools": ["weather", "news", "reminder"],
      "memory": {
        "namespace": "life"
      },
      "systemPrompt": "你是生活助手，擅长天气查询、新闻摘要和生活建议。"
    },

    "coder": {
      "name": "编程助手",
      "model": "gpt-4o",
      "temperature": 0.2,              // 代码生成需要精确
      "soulFile": "workspace/agents/coder-soul.md",
      "tools": ["code_exec", "git", "search"],
      "memory": {
        "namespace": "coding"
      },
      "systemPrompt": "你是编程助手，擅长代码编写、调试和技术方案设计。"
    }
  }
}
```

### 方式二：使用独立 Markdown 文件

```
workspace/agents/
├── work.md
├── life.md
└── coder.md
```

`workspace/agents/coder.md` 示例：

```markdown
# 编程助手 Agent

## 名称
编程助手

## 模型
gpt-4o

## 参数
- temperature: 0.2
- maxTokens: 8192

## 人格
你是一位资深的全栈开发工程师。你擅长：
- Python、JavaScript、TypeScript、Go、Rust
- 系统设计和技术方案评审
- 代码审查和性能优化

## 工具
- code_exec: 代码执行
- git: 版本控制
- search: 技术文档搜索

## 回答原则
1. 代码必须可运行，包含必要的 import
2. 优先给出完整实现而非伪代码
3. 注释使用中文
4. 遇到安全问题必须指出
```

## Agent 路由绑定

将 Agent 与路由规则关联：

```json5
{
  "routing": {
    "defaultAgent": "general",
    "rules": [
      // 命令式路由
      { "type": "exact", "match": "/work", "agent": "work" },
      { "type": "exact", "match": "/life", "agent": "life" },
      { "type": "exact", "match": "/code", "agent": "coder" },

      // 正则路由
      { "type": "regex", "match": "(邮件|email|日程|calendar)", "agent": "work" },
      { "type": "regex", "match": "(天气|新闻|提醒)", "agent": "life" },
      { "type": "regex", "match": "(代码|code|bug|debug|编程)", "agent": "coder" },

      // 渠道路由
      { "type": "channel", "match": "email", "agent": "work" }
    ]
  }
}
```

## Agent 间协作

Agent 可以将任务转发给其他 Agent：

```json5
{
  "agents": {
    "general": {
      "name": "总调度",
      "delegateTo": ["work", "life", "coder"],
      "systemPrompt": `你是总调度 Agent。根据用户需求判断应该转发给哪个 Agent：
- 工作相关 → 转发给 work
- 生活相关 → 转发给 life
- 编程相关 → 转发给 coder
- 不确定时自己处理`
    }
  }
}
```

## Agent 管理命令

```bash
# 列出所有 Agent
openclaw agent list

# 查看特定 Agent 配置
openclaw agent show coder

# 直接与特定 Agent 对话
openclaw chat --agent coder

# 测试 Agent 路由
openclaw routing test "帮我修一个 bug"
# → coder
```

## 小结

本节课详细介绍了 OpenClaw 的多 Agent 系统。通过为每个 Agent 配置独立的人格、模型、工具和记忆命名空间，你可以打造一个分工明确的多助手系统。路由规则负责将用户消息精准分发到合适的 Agent，Agent 间协作机制则支持复杂的多步工作流。下一节课我们将学习 Prompt 工程的 8 层架构。
