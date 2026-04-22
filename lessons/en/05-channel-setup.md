# Lesson 5: Channel Setup

Channels are how your assistant reaches the outside world. Each channel connects OpenClaw to a messaging platform, allowing users on Telegram, Discord, Slack, and dozens of other services to interact with your AI agent. This lesson covers the setup process for the three most popular channels.

## Learning Objectives

- Understand the channel abstraction and how it works
- Configure a Telegram bot channel
- Set up a Discord webhook channel
- Integrate with Slack using a bot token
- Register channels in `openclaw.json`

## Prerequisites

- Completion of Lesson 4 (Your First Conversation)
- Accounts on the messaging platforms you want to integrate

## Channel Overview

A channel in OpenClaw is a bidirectional bridge between a messaging platform and the agent's prompt pipeline. When a user sends a message on a connected channel, the daemon receives it, assembles the prompt stack (workspace files + session history + memory), sends it to the LLM, and posts the response back to the channel.

OpenClaw ships with built-in adapters for:

- **Telegram** - via the Bot API
- **Discord** - via webhooks or a bot user
- **Slack** - via the Bolt SDK
- **WebChat** - built-in browser UI
- **IRC** - via IRC client protocol
- **Email** - via IMAP/SMTP polling

Additional channels are available as installable skills through ClawHub (covered in Lesson 11).

## Telegram Bot Setup

Telegram is one of the easiest channels to set up because it uses a simple polling-based Bot API.

### Step 1: Create a Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts to choose a name and username.
3. Copy the API token that BotFather returns. It looks like `7123456789:AAHx...`.

### Step 2: Configure in openclaw.json

```json5
channels: {
  telegram: {
    enabled: true,
    token: "${TELEGRAM_BOT_TOKEN}",
    // Optional: restrict to specific chat IDs
    allowedChatIds: [123456789],
    // Optional: customize the command prefix
    commandPrefix: "/",
  },
}
```

Set the `TELEGRAM_BOT_TOKEN` environment variable in your `.env` file:

```bash
TELEGRAM_BOT_TOKEN=7123456789:AAHx...
```

### Step 3: Test the Connection

```bash
openclaw channels test telegram
```

This sends a test message to the bot and verifies the round-trip. If successful, your bot should appear online in Telegram and respond to messages.

### Allowed Chat IDs

Use `allowedChatIds` to restrict which Telegram chats the bot responds to. This is a security measure that prevents strangers from using your assistant. To find a chat ID, send a message to your bot and check the daemon logs -- the chat ID is printed on every incoming message.

## Discord Webhook Configuration

Discord supports two integration modes: webhooks (simpler) and bot users (more capable). Webhooks are recommended for posting into specific channels, while bot users can listen across an entire server.

### Step 1: Create a Webhook

1. Open your Discord server settings.
2. Navigate to **Integrations > Webhooks**.
3. Create a new webhook for the target channel.
4. Copy the webhook URL.

### Step 2: Configure in openclaw.json

```json5
channels: {
  discord: {
    enabled: true,
    mode: "webhook",
    webhookUrl: "${DISCORD_WEBHOOK_URL}",
    // Optional: bot username override
    username: "Atlas",
    // Optional: bot avatar URL
    avatarUrl: "https://example.com/atlas-avatar.png",
  },
}
```

### Step 3: Verify

```bash
openclaw channels test discord
```

This posts a test message to the Discord channel associated with the webhook. Note that webhook mode only supports posting messages into a specific channel -- it cannot listen for user replies. For full bidirectional chat, use `mode: "bot"` with a Discord bot token instead.

## Slack App Integration

Slack integration uses a bot token with the `chat:write` and `app_mentions:read` scopes.

### Step 1: Create a Slack App

1. Go to https://api.slack.com/apps and click **Create New App**.
2. Assign the bot to your workspace.
3. Under **OAuth & Permissions**, add the scopes: `chat:write`, `app_mentions:read`, `channels:history`, `groups:history`.
4. Install the app to your workspace and copy the **Bot User OAuth Token** (starts with `xoxb-`).

### Step 2: Configure in openclaw.json

```json5
channels: {
  slack: {
    enabled: true,
    botToken: "${SLACK_BOT_TOKEN}",
    signingSecret: "${SLACK_SIGNING_SECRET}",
    // Optional: only respond in these channels
    allowedChannels: ["C0123456789"],
  },
}
```

### Step 3: Enable Event Subscriptions

In your Slack app settings, enable **Event Subscriptions** and set the request URL to:

```
https://your-domain.com:3000/hooks/slack
```

Subscribe to the `app_mention` and `message.channels` events. Slack will send a URL verification challenge that OpenClaw handles automatically.

## Channel Configuration Reference

Every channel shares a common set of optional fields:

```json5
{
  enabled: true,            // Master toggle
  agent: "default",         // Which agent handles this channel
  rateLimit: 60,            // Messages per minute per user
  maxMessageLength: 4096,   // Truncate responses exceeding this
  systemPrompt: "",         // Override the system prompt for this channel only
}
```

The `agent` field is particularly useful when running multiple agents (Lesson 8). You can point different channels at different agents to create specialized interfaces for different audiences.

## Summary

You now have the knowledge to connect OpenClaw to Telegram, Discord, and Slack. Each channel follows the same pattern: create credentials on the platform, add the configuration to `openclaw.json`, and verify with `openclaw channels test`. In the next lesson we will explore running multiple channels simultaneously and scaling to over 25 supported platforms.
