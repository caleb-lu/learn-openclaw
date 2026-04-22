# 配置详解

OpenClaw 使用 `openclaw.json` 作为核心配置文件，支持 JSON5 语法，允许注释和尾随逗号。本节课将全面解读配置文件的各个字段，帮助你根据需求精确调校 OpenClaw 的行为。

## 学习目标

- 掌握 openclaw.json 的完整结构与层级关系
- 了解 JSON5 语法优势与注意事项
- 理解 LLM、渠道、路由等核心配置项
- 学会使用环境变量覆盖配置
- 能够根据场景编写定制化配置

## 前置知识

- 已完成 OpenClaw 安装（第 01 节）
- 了解 JSON 格式基础
- 熟悉常见 LLM API（OpenAI / Anthropic）

## 配置文件位置

OpenClaw 按以下优先级查找配置：

1. 命令行参数 `--config /path/to/config.json5`
2. 当前目录下的 `openclaw.json5` 或 `openclaw.json`
3. 工作空间目录 `~/.openclaw/openclaw.json5`

## 最小配置示例

```json5
// openclaw.json5 — 最小可运行配置
{
  // LLM 提供商配置
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "apiKey": "sk-xxxxxxxxxxxx"
  },

  // 网关服务端口
  "gateway": {
    "port": 3000
  }
}
```

## 完整配置参考

```json5
{
  // ==================== LLM 配置 ====================
  "llm": {
    "provider": "openai",           // openai | anthropic | ollama | custom
    "model": "gpt-4o",
    "apiKey": "${OPENAI_API_KEY}",  // 支持环境变量引用
    "baseUrl": "https://api.openai.com/v1",
    "temperature": 0.7,
    "maxTokens": 4096,
    "timeout": 30000,               // 毫秒
    "retry": {
      "maxAttempts": 3,
      "backoffMs": 1000
    }
  },

  // ==================== Gateway 配置 ====================
  "gateway": {
    "port": 3000,
    "host": "0.0.0.0",
    "logLevel": "info",             // debug | info | warn | error
    "cors": {
      "enabled": true,
      "origins": ["*"]
    }
  },

  // ==================== 渠道配置 ====================
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}"
    },
    "discord": {
      "enabled": true,
      "webhook": {
        "url": "/webhook/discord",
        "publicUrl": "https://your-domain.com"
      }
    },
    "slack": {
      "enabled": false,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}"
    }
  },

  // ==================== 路由配置 ====================
  "routing": {
    "defaultAgent": "general",
    "rules": [
      {
        "pattern": "^/code",
        "agent": "coder",
        "description": "编程相关请求路由到编程助手"
      }
    ]
  },

  // ==================== Agent 配置 ====================
  "agents": {
    "general": {
      "name": "通用助手",
      "model": "gpt-4o",
      "systemPrompt": "你是一个友好的通用 AI 助手。"
    },
    "coder": {
      "name": "编程助手",
      "model": "gpt-4o",
      "systemPrompt": "你是一个专业的编程助手。"
    }
  },

  // ==================== 记忆配置 ====================
  "memory": {
    "enabled": true,
    "maxEntries": 1000,
    "autoRecall": true,
    "dailySummary": true
  },

  // ==================== 定时任务 ====================
  "schedules": [],

  // ==================== 技能配置 ====================
  "skills": {
    "autoInstall": false,
    "registry": "https://clawhub.openclaw.dev"
  }
}
```

## 环境变量覆盖

使用 `${VAR_NAME}` 语法引用环境变量，避免将敏感信息写入配置文件：

```bash
# .env 文件
OPENAI_API_KEY=sk-xxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
SLACK_BOT_TOKEN=xoxb-xxxx-xxxx
```

```bash
# 加载 .env 并启动
export $(cat .env | xargs) && openclaw start
```

## JSON5 语法特性

JSON5 是 JSON 的超集，支持以下额外特性：

```json5
{
  // 1. 支持注释（单行和多行）
  /* 多行注释 */

  // 2. 支持尾随逗号
  "channels": {
    "telegram": { "enabled": true },
    "discord": { "enabled": true },   // 尾随逗号没问题
  },

  // 3. 键名可以不加引号
  llm: {
    provider: "openai"
  },

  // 4. 支持多行字符串
  systemPrompt: `
    你是一个专业的 AI 助手。
    请用简洁清晰的中文回答问题。
  `
}
```

## 配置验证

修改配置后，建议先进行验证再重启服务：

```bash
# 验证配置文件语法
openclaw config validate

# 查看当前生效的完整配置（展开所有默认值）
openclaw config show

# 检查特定配置项
openclaw config get llm.provider
```

## 小结

本节课详细讲解了 OpenClaw 配置文件的结构与所有核心字段。JSON5 语法让配置文件更加易读易维护，环境变量引用机制确保了敏感信息的安全。理解每个配置项的作用，是后续灵活定制 OpenClaw 行为的关键。下一节课我们将学习工作空间的结构与人格定制。
