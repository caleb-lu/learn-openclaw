# 渠道接入

OpenClaw 的一个核心优势是能够接入多种外部通讯平台，让你可以通过 Telegram、Discord、Slack 等常用工具与 AI 助手对话。本节课将详细介绍三大主流渠道的接入方法。

## 学习目标

- 理解 OpenClaw 渠道接入的基本架构
- 掌握 Telegram Bot 的创建与配置方法
- 学会配置 Discord Webhook
- 完成 Slack App 的接入设置
- 能够在任一渠道中与助手进行对话

## 前置知识

- 已完成 OpenClaw 安装与配置（第 01-02 节）
- 拥有 Telegram / Discord / Slack 账号
- 了解基本的 Bot 创建流程

## 渠道架构概览

```
用户 ←→ 通讯平台 ←→ OpenClaw Gateway ←→ Agent ←→ LLM
                  (渠道适配层)         (路由层)
```

OpenClaw Gateway 作为中间层，通过渠道适配器与各平台对接。所有渠道共享同一个 AI 助手人格和记忆系统。

## Telegram Bot 接入

### 第一步：创建 Bot

1. 在 Telegram 中搜索 `@BotFather`
2. 发送 `/newbot` 命令
3. 按提示设置 Bot 名称和用户名
4. 获取 Bot Token（格式：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

### 第二步：配置 OpenClaw

```json5
// openclaw.json5
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "allowedUsers": ["your_telegram_id"],   // 可选：白名单
      "webhookUrl": "https://your-domain.com/webhook/telegram"
    }
  }
}
```

### 第三步：设置 Webhook（可选）

使用 Webhook 模式可以获得更快的响应速度（相比轮询模式）：

```bash
# 设置 Webhook
openclaw channel telegram set-webhook \
  --url "https://your-domain.com/webhook/telegram" \
  --secret "your_webhook_secret"

# 切换回轮询模式
openclaw channel telegram set-polling
```

### 第四步：测试

```bash
# 检查渠道状态
openclaw channel telegram status

# 在 Telegram 中给你的 Bot 发消息，应该能收到回复
```

## Discord 接入

### 第一步：创建 Discord Application

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 "New Application"，设置名称
3. 在 "Bot" 页面创建 Bot，获取 Token
4. 在 "OAuth2" 页面生成邀请链接（勾选 `bot` 和 `applications.commands` scope）

### 第二步：邀请 Bot 到服务器

使用生成的邀请链接，将 Bot 添加到你的 Discord 服务器。

### 第三步：配置 OpenClaw

```json5
// openclaw.json5
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "${DISCORD_BOT_TOKEN}",
      "clientId": "your_client_id",
      "guildId": "your_guild_id",
      "allowedChannels": ["general", "ai-help"],  // 可选
      "prefix": "/"                               // 命令前缀
    }
  }
}
```

### 第四步：启动并验证

```bash
# 启动 Gateway
openclaw start

# 检查 Discord 渠道状态
openclaw channel discord status

# 在 Discord 频道中 @你的Bot 或使用 /chat 命令
```

## Slack App 接入

### 第一步：创建 Slack App

1. 前往 [Slack API](https://api.slack.com/apps)
2. 点击 "Create New App"，选择 "From scratch"
3. 设置 App 名称和工作空间

### 第二步：配置权限与事件

在 Slack App 设置页面：

1. **OAuth & Permissions**：添加以下 Bot Token Scopes：
   - `chat:write`
   - `channels:history`
   - `groups:history`
   - `im:history`
   - `app_mentions:read`
   - `message.im`

2. **Event Subscriptions**：启用并添加订阅 URL：
   ```
   https://your-domain.com/webhook/slack
   ```
   订阅事件：`message.im`、`message.channels`、`app_mention`

3. **Install App**：安装到工作空间，获取 `Bot Token` 和 `App Token`

### 第三步：配置 OpenClaw

```json5
// openclaw.json5
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}",
      "signingSecret": "${SLACK_SIGNING_SECRET}",
      "allowedChannels": ["C0123456789"]   // 可选：频道白名单
    }
  }
}
```

### 第四步：启动并验证

```bash
# 启动 Gateway（Slack Socket Mode 需要此方式）
openclaw start

# 检查状态
openclaw channel slack status

# 在 Slack 中直接发私信给 Bot，或在频道中 @Bot
```

## 渠道通用管理命令

```bash
# 查看所有渠道状态
openclaw channel list

# 启用/禁用特定渠道
openclaw channel enable telegram
openclaw channel disable discord

# 测试渠道连通性
openclaw channel test telegram

# 查看渠道的实时消息流
openclaw channel logs telegram --follow
```

## 小结

本节课详细介绍了 Telegram、Discord 和 Slack 三大主流渠道的接入方法。每种渠道的接入流程都分为四步：创建应用/机器人、获取凭证、配置 OpenClaw、启动验证。所有渠道共享统一的 Gateway 和 AI 助手人格。下一节课我们将学习多渠道协同运行。
