# 多渠道协同

OpenClaw 支持同时接入 25+ 种通讯渠道，并在它们之间实现并行运行与协同工作。这意味着你可以通过 Telegram、Discord、Slack、微信、邮件等任意组合与同一个 AI 助手交互。本节课将探讨多渠道架构与协同策略。

## 学习目标

- 了解 OpenClaw 支持的所有渠道类型
- 掌握多渠道并行配置的方法
- 理解跨渠道会话共享与隔离机制
- 学会为不同渠道设置差异化行为
- 能够构建多渠道协同的 AI 助手系统

## 前置知识

- 已完成至少一个渠道的接入（第 05 节）
- 理解 OpenClaw 的路由机制
- 了解基本的网络概念（Webhook、WebSocket）

## 支持的渠道一览

OpenClaw 目前支持以下渠道类型：

| 类型 | 渠道 | 协议 |
|------|------|------|
| 即时通讯 | Telegram、WeChat、WhatsApp | Bot API / Webhook |
| 社交平台 | Discord、Slack、Matrix | WebSocket / Webhook |
| 邮件 | SMTP / IMAP | 邮件协议 |
| Web | WebChat、REST API | HTTP |
| 语音 | 自定义语音节点 | WebSocket |
| IoT | MQTT | MQTT 协议 |
| 开发工具 | VS Code Extension、Terminal | 进程间通信 |

## 多渠道并行配置

在配置文件中启用多个渠道：

```json5
{
  "channels": {
    // 即时通讯
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}"
    },

    // 社交平台
    "discord": {
      "enabled": true,
      "botToken": "${DISCORD_BOT_TOKEN}",
      "prefix": "/"
    },

    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}"
    },

    // 邮件
    "email": {
      "enabled": true,
      "imap": {
        "host": "imap.gmail.com",
        "port": 993,
        "user": "${EMAIL_USER}",
        "pass": "${EMAIL_PASS}"
      },
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "user": "${EMAIL_USER}",
        "pass": "${EMAIL_PASS}"
      },
      "checkInterval": 60
    },

    // Web API
    "webchat": {
      "enabled": true,
      "port": 3000,
      "auth": {
        "enabled": true,
        "token": "${WEBSOCKET_AUTH_TOKEN}"
      }
    },

    // 开发工具
    "terminal": {
      "enabled": true
    }
  }
}
```

## 跨渠道会话管理

### 会话共享模式

默认情况下，同一用户在不同渠道的会话是相互隔离的。你可以开启跨渠道会话共享：

```json5
{
  "session": {
    "crossChannel": true,         // 开启跨渠道共享
    "identityKey": "userId",      // 识别用户的键
    "mergeStrategy": "latest"     // latest | separate | merge
  }
}
```

### 会话隔离模式

如果你希望不同渠道有独立的会话上下文：

```json5
{
  "session": {
    "crossChannel": false,
    "isolation": {
      "telegram": "work_context",
      "discord": "casual_context",
      "slack": "team_context"
    }
  }
}
```

## 渠道差异化配置

不同渠道可以有不同的行为风格：

```json5
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "personality": "concise",           // 简洁风格
      "responseFormat": "markdown",
      "maxMessageLength": 4096
    },
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "personality": "professional",      // 专业风格
      "responseFormat": "mrkdwn",         // Slack 原生格式
      "threadReplies": true               // 使用线程回复
    },
    "discord": {
      "enabled": true,
      "botToken": "${DISCORD_BOT_TOKEN}",
      "personality": "casual",            // 休闲风格
      "responseFormat": "markdown",
      "embedSupport": true                // 支持 Embed 消息
    }
  }
}
```

## 消息广播与转发

OpenClaw 支持跨渠道消息转发：

```json5
{
  "routing": {
    "broadcast": {
      "enabled": true,
      "rules": [
        {
          "from": "email",
          "to": ["telegram", "slack"],
          "filter": "important"           // 只转发标记为重要的邮件
        }
      ]
    }
  }
}
```

## 渠道健康监控

```bash
# 查看所有渠道状态
openclaw channel list

# 输出示例：
# telegram    ✅ connected    (5 messages/min)
# discord     ✅ connected    (12 messages/min)
# slack       ✅ connected    (3 messages/min)
# email       ✅ polling      (last check: 30s ago)
# webchat     ✅ listening    (port 3000)

# 监控渠道性能
openclaw monitor channels

# 设置渠道故障告警
openclaw channel alert --type discord --webhook "${ALERT_WEBHOOK_URL}"
```

## 并发与性能考虑

当同时运行多个渠道时，注意以下性能优化点：

```json5
{
  "gateway": {
    "maxConcurrentRequests": 50,    // 最大并发请求数
    "queueSize": 1000,              // 消息队列大小
    "rateLimit": {
      "global": 100,                // 全局速率限制（请求/分钟）
      "perChannel": 30              // 单渠道速率限制
    }
  }
}
```

## 小结

本节课探讨了 OpenClaw 的多渠道协同能力。通过合理配置，你可以让 AI 助手在 25+ 种渠道中并行运行，并根据场景为不同渠道定制差异化行为。跨渠道会话管理让你在切换平台时保持对话连贯性。下一节课我们将学习路由规则的配置与使用。
