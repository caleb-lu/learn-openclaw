# Lesson 6: Multi-Channel Coordination

One of OpenClaw's strongest features is its ability to run many channels in parallel from a single daemon process. Whether your users are on Telegram, Discord, Slack, IRC, or email, they all interact with the same assistant and share the same memory and personality. This lesson covers parallel channel execution, cross-channel session management, and scaling considerations.

## Learning Objectives

- Run multiple channels simultaneously from a single daemon
- Understand the full list of 25+ supported platforms
- Manage sessions that span across channels
- Apply scaling strategies for high-traffic deployments

## Prerequisites

- Completion of Lesson 5 (Channel Setup)
- At least two channels configured and tested

## Running Multiple Channels Simultaneously

Enabling multiple channels is as simple as listing them in `openclaw.json`. The daemon starts a listener for each enabled channel at boot time:

```json5
channels: {
  webchat: { enabled: true },
  telegram: {
    enabled: true,
    token: "${TELEGRAM_BOT_TOKEN}",
  },
  discord: {
    enabled: true,
    mode: "bot",
    token: "${DISCORD_BOT_TOKEN}",
  },
  slack: {
    enabled: true,
    botToken: "${SLACK_BOT_TOKEN}",
    signingSecret: "${SLACK_SIGNING_SECRET}",
  },
  irc: {
    enabled: true,
    server: "irc.libera.chat",
    nick: "AtlasBot",
    channels: ["#atlas-users"],
  },
  email: {
    enabled: true,
    imap: {
      host: "imap.gmail.com",
      port: 993,
      user: "atlas@gmail.com",
      pass: "${EMAIL_APP_PASSWORD}",
    },
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      user: "atlas@gmail.com",
      pass: "${EMAIL_APP_PASSWORD}",
    },
  },
}
```

At startup the daemon prints a channel summary:

```
Channels:
  webchat  : listening on :3000
  telegram : polling @AtlasBot
  discord  : connected to 3 guilds
  slack    : workspace "Acme Corp"
  irc      : connected to irc.libera.chat
  email    : IMAP polling every 30s
```

Each channel runs in its own lightweight coroutine, so a slow response on one channel does not block the others.

## 25+ Supported Platforms

OpenClaw's channel ecosystem covers a wide range of platforms. Built-in channels include:

| Category       | Platforms                                      |
|----------------|------------------------------------------------|
| Messaging      | Telegram, Discord, Slack, IRC, Matrix, Mattermost |
| Social         | Twitter/X, Mastodon, Reddit                    |
| Email          | IMAP/SMTP, SendGrid, Mailgun                   |
| Voice          | Twilio, Vonage, Amazon Connect                 |
| SMS            | Twilio SMS, Clickatell                         |
| Web            | WebChat, REST API, GraphQL subscriptions        |
| IoT            | MQTT, WebSocket, Webhook                       |
| DevOps         | GitHub, GitLab, Jira, PagerDuty                |
| Custom         | Any HTTP endpoint via the generic webhook channel |

Community-contributed channel adapters are available on ClawHub. If your platform is not listed, you can write a custom adapter using the Channel SDK (a thin abstraction over HTTP and WebSocket).

## Channel Parallel Execution

The daemon uses an event loop architecture to handle concurrent channel traffic efficiently. Each incoming message goes through the same pipeline:

```
Channel Adapter  -->  Rate Limiter  -->  Prompt Assembler  -->  LLM Call  -->  Response Router  -->  Channel Adapter
```

The rate limiter enforces per-user and per-channel quotas to prevent abuse. The prompt assembler adds workspace files, session history, and memory. The LLM call is non-blocking, so multiple messages from different channels can be in flight at the same time.

```bash
# Monitor active channel connections in real time
openclaw channels monitor

# View per-channel message throughput
openclaw channels stats
```

The `stats` command shows messages sent, received, average latency, and error counts for each channel over configurable time windows.

## Cross-Channel Session Management

By default, each channel maintains its own session per user. A Telegram conversation and a Discord conversation from the same person are treated as separate sessions. However, you can enable cross-channel session linking:

```json5
{
  sessions: {
    // Link sessions by user identity across channels
    crossChannel: true,
    // Identity resolution strategy
    identityResolver: "email",  // "email" | "username" | "manual"
  },
}
```

When `crossChannel` is enabled, the daemon attempts to merge sessions from different channels that belong to the same user. The `identityResolver` determines how user identity is matched. For example, with `email` resolution, if a Slack user and a Telegram user share the same email address in their profiles, their sessions are linked.

Cross-channel sessions share message history, meaning a conversation that starts on Telegram can seamlessly continue on Discord. This is useful for personal assistants but may not be desirable for public-facing bots where channel isolation is preferred.

## Scaling Considerations

A single OpenClaw daemon can handle hundreds of concurrent conversations on modern hardware. For higher loads, consider these strategies:

### Vertical Scaling

Increase resources for the daemon process:

```bash
# Run with increased Node.js heap
NODE_OPTIONS="--max-old-space-size=4096" openclaw daemon start
```

### Horizontal Scaling

Run multiple daemon instances behind a load balancer. Share the data directory via a network filesystem or object storage:

```json5
{
  server: {
    port: 3000,
    cluster: {
      enabled: true,
      instances: 4,       // number of worker processes
    },
  },
}
```

When `cluster.enabled` is true, the daemon forks multiple worker processes that share the same port. The operating system distributes incoming connections across workers.

### LLM Provider Scaling

The most common bottleneck is LLM API rate limits. Configure fallback providers to ensure continuity:

```json5
model: {
  provider: "openai",
  name: "gpt-4o",
  fallbacks: [
    { provider: "anthropic", name: "claude-sonnet-4-20250514" },
    { provider: "google", name: "gemini-pro" },
  ],
}
```

If the primary provider returns a 429 (rate limit) or 5xx (server error), OpenClaw automatically retries with the next fallback provider.

## Summary

OpenClaw makes multi-channel operation straightforward. You can run dozens of channels from a single daemon, link sessions across platforms, and scale vertically or horizontally to meet demand. In the next lesson we will explore routing rules, which let you control which messages go to which agent based on patterns and priorities.
