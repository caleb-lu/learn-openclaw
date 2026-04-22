# 路由规则

OpenClaw 使用 5 层绑定表实现灵活的消息路由。路由规则决定了每条消息应该由哪个 Agent 处理、使用什么人格、应用哪些技能。本节课将深入解析路由系统的工作原理与配置方法。

## 学习目标

- 理解 OpenClaw 5 层绑定表的优先级与匹配逻辑
- 掌握路由规则的模式匹配语法
- 学会为不同类型的消息配置专用 Agent
- 了解路由规则的条件表达式
- 能够设计复杂的多层路由策略

## 前置知识

- 已完成 OpenClaw 配置（第 02 节）
- 了解正则表达式基础
- 理解 Agent 的概念（后续第 08 节详解）

## 5 层绑定表

OpenClaw 的路由系统从高到低分为 5 层，消息会逐层匹配，命中即停止：

```
┌─────────────────────────────────────────────┐
│  第 1 层：精确匹配（Exact Match）            │  优先级最高
│  第 2 层：正则匹配（Regex Pattern）          │
│  第 3 层：关键词匹配（Keyword Match）        │
│  第 4 层：渠道匹配（Channel Match）          │
│  第 5 层：默认路由（Default Route）          │  优先级最低
└─────────────────────────────────────────────┘
```

## 基础路由配置

```json5
{
  "routing": {
    // 默认 Agent（第 5 层）
    "defaultAgent": "general",

    // 路由规则列表（第 1-4 层）
    "rules": [
      // 第 1 层：精确匹配
      {
        "type": "exact",
        "match": "/help",
        "agent": "helper",
        "description": "帮助命令路由到帮助 Agent"
      },
      {
        "type": "exact",
        "match": "/status",
        "agent": "system",
        "response": "system_status_template"
      },

      // 第 2 层：正则匹配
      {
        "type": "regex",
        "match": "^/code\\s+.+",
        "agent": "coder",
        "description": "以 /code 开头的消息路由到编程助手"
      },
      {
        "type": "regex",
        "match": "(翻译|translate)\\s+(.+)",
        "agent": "translator",
        "captureGroups": {
          "text": 2
        }
      },

      // 第 3 层：关键词匹配
      {
        "type": "keyword",
        "match": ["bug", "error", "报错", "调试"],
        "agent": "coder",
        "priority": 10
      },
      {
        "type": "keyword",
        "match": ["天气", "weather", "温度"],
        "agent": "general",
        "tools": ["weather"]
      },

      // 第 4 层：渠道匹配
      {
        "type": "channel",
        "match": "email",
        "agent": "email_assistant",
        "personality": "formal",
        "description": "邮件渠道使用正式风格"
      }
    ]
  }
}
```

## 正则匹配详解

正则匹配是最灵活的路由方式：

```json5
{
  "routing": {
    "rules": [
      // 捕获参数
      {
        "type": "regex",
        "match": "^/search\\s+(.+)",
        "agent": "searcher",
        "extract": {
          "query": "$1"
        },
        "description": "/search <关键词> → 搜索 Agent"
      },

      // 多条件组合
      {
        "type": "regex",
        "match": "(?i)(python|java|javascript)\\s+(教程|tutorial)",
        "agent": "coder",
        "description": "编程语言教程请求"
      },

      // 带优先级的正则
      {
        "type": "regex",
        "match": "^/summarize\\s+url:(.+)",
        "agent": "summarizer",
        "priority": 5,
        "extract": {
          "url": "$1"
        }
      }
    ]
  }
}
```

## 条件路由

支持基于条件的复杂路由逻辑：

```json5
{
  "routing": {
    "rules": [
      {
        "type": "regex",
        "match": ".+",
        "agent": "general",
        "conditions": {
          "timeRange": {
            "start": "09:00",
            "end": "18:00",
            "timezone": "Asia/Shanghai"
          },
          "channel": "telegram",
          "fallback": "offduty"
        },
        "description": "工作时间内的 Telegram 消息由通用 Agent 处理"
      },
      {
        "type": "regex",
        "match": ".+",
        "agent": "offduty",
        "personality": "casual",
        "description": "非工作时间使用休闲模式"
      }
    ]
  }
}
```

## 路由调试

当路由行为不符合预期时，可以使用调试工具：

```bash
# 测试消息匹配哪条路由规则
openclaw routing test "帮我写一个 Python 脚本"
# 输出：匹配规则 #3 (keyword) → agent: coder

openclaw routing test "/code 实现快速排序"
# 输出：匹配规则 #2 (regex) → agent: coder

openclaw routing test "/help"
# 输出：匹配规则 #1 (exact) → agent: helper

# 查看完整的路由表（按优先级排序）
openclaw routing list

# 查看路由匹配的详细过程
openclaw routing explain "今天天气怎么样"
```

## 路由最佳实践

1. **精确匹配优先**：将精确匹配规则放在最前面
2. **合理使用优先级**：优先级数字越大越优先（默认为 0）
3. **避免规则重叠**：确保规则之间不会产生歧义
4. **设置默认路由**：始终配置 defaultAgent 作为兜底
5. **定期测试**：使用 `routing test` 命令验证规则效果

## 小结

本节课深入解析了 OpenClaw 的 5 层路由绑定表。从精确匹配到默认路由，每层都有明确的职责和使用场景。通过正则匹配和条件表达式，你可以构建精细化的消息分发策略。合理设计路由规则是打造多 Agent 系统的关键。下一节课我们将学习多 Agent 的配置与协作。
