# Lesson 17: Capstone -- Your 24/7 AI Assistant

This capstone lesson brings together every concept from the previous sixteen lessons into a single, production-ready deployment. You will build a complete 24/7 AI assistant that uses multiple channels, multiple agents, scheduled tasks, webhooks, memory, skills, and voice capabilities. By the end, you will have a fully operational personal and professional AI companion.

## Learning Objectives

- Combine all learned concepts into a unified deployment
- Write a complete `openclaw.json` configuration
- Build a workspace with full personality and memory
- Set up multi-channel communication with routing
- Automate tasks with schedules and webhooks
- Deploy and monitor the system

## Prerequisites

- Completion of all previous lessons (Lessons 1-16)
- API keys for your chosen LLM provider, Telegram, Slack, and GitHub
- A server or VPS for deployment

## Project Overview and Requirements

Our capstone assistant, called "Atlas," serves both personal and professional roles:

- **Work Agent (Slack):** Handles team communication, Jira ticket summaries, GitHub PR reviews, and daily standups.
- **Personal Agent (Telegram):** Provides weather, news, reminders, and casual conversation.
- **Coding Agent (WebChat):** Assists with code review, debugging, and technical documentation.
- **Voice Node (Living room):** Responds to voice commands for smart home control and queries.
- **Automation:** Morning briefings, weekly reviews, GitHub event notifications, and memory pruning.

## Complete openclaw.json Configuration

Here is the full configuration file that ties everything together:

```json5
{
  name: "Atlas",

  // ---- Model Configuration ----
  model: {
    provider: "openai",
    name: "gpt-4o",
    temperature: 0.7,
    maxTokens: 4096,
    fallbacks: [
      { provider: "anthropic", name: "claude-sonnet-4-20250514" },
    ],
  },

  // ---- Server ----
  server: {
    port: 3000,
    baseUrl: "https://atlas.example.com",
  },

  // ---- Memory ----
  memory: {
    enabled: true,
    snapshots: {
      enabled: true,
      frequency: "daily",
      retention: 30,
    },
    recall: {
      maxEntries: 10,
      minScore: 0.3,
      decayRate: 0.05,
    },
    pruning: {
      enabled: true,
      maxEntries: 200,
      maxAge: "90d",
    },
  },

  // ---- Channels ----
  channels: {
    webchat: { enabled: true },
    telegram: {
      enabled: true,
      token: "${TELEGRAM_BOT_TOKEN}",
      allowedChatIds: [123456789],
    },
    slack: {
      enabled: true,
      botToken: "${SLACK_BOT_TOKEN}",
      signingSecret: "${SLACK_SIGNING_SECRET}",
    },
    discord: {
      enabled: true,
      mode: "webhook",
      webhookUrl: "${DISCORD_WEBHOOK_URL}",
    },
  },

  // ---- Nodes ----
  nodes: {
    enabled: true,
    auth: {
      type: "token",
      tokens: ["${NODE_TOKEN}"],
    },
    groups: {
      "home": ["living-room-speaker"],
    },
  },

  // ---- Agents ----
  agents: [
    {
      id: "work",
      name: "Atlas (Work)",
      workspace: "./workspaces/work",
      skills: ["jira", "calendar", "github", "email-draft"],
      model: { temperature: 0.3 },
    },
    {
      id: "personal",
      name: "Atlas (Personal)",
      workspace: "./workspaces/personal",
      skills: ["weather", "news", "recipes", "timer"],
      model: { temperature: 0.8 },
    },
    {
      id: "coder",
      name: "Atlas (Coding)",
      workspace: "./workspaces/coder",
      skills: ["github", "docker", "k8s", "code-review"],
    },
  ],

  // ---- Routing ----
  routing: [
    { channel: "slack", pattern: "*", agent: "work", priority: 10 },
    { channel: "telegram", pattern: "*", agent: "personal", priority: 10 },
    { channel: "webchat", pattern: "*", agent: "coder", priority: 10 },
    { channel: "discord", pattern: "*", agent: "coder", priority: 10 },
    { pattern: "regex:\\b(deploy|release|rollback)\\b", agent: "coder", priority: 50 },
  ],

  // ---- Scheduled Tasks ----
  schedule: [
    {
      name: "morning-briefing",
      cron: "0 8 * * 1-5",
      timezone: "America/New_York",
      agent: "work",
      message: "Create a morning briefing with today's calendar, pending Jira tickets, and recent GitHub activity.",
      channel: "slack",
    },
    {
      name: "weekly-review",
      cron: "0 17 * * 5",
      timezone: "America/New_York",
      agent: "work",
      message: "Write a weekly review: completed tasks, decisions made, and goals for next week.",
      channel: "slack",
      canvas: true,
    },
    {
      name: "personal-digest",
      cron: "0 7 * * *",
      timezone: "America/New_York",
      agent: "personal",
      message: "Good morning! Here is today's weather, top news headlines, and any reminders.",
      channel: "telegram",
    },
    {
      name: "memory-prune",
      cron: "0 2 * * *",
      timezone: "UTC",
      agent: "work",
      action: "memory.prune",
    },
  ],

  // ---- Webhooks ----
  webhooks: {
    enabled: true,
    prefix: "/hooks",
    endpoints: [
      {
        name: "github-events",
        path: "github",
        agent: "coder",
        secret: "${GITHUB_WEBHOOK_SECRET}",
        events: ["push", "pull_request", "issues"],
        forwardTo: "slack",
      },
    ],
  },

  // ---- Voice ----
  voice: {
    enabled: true,
    wakeWord: "atlas",
    stt: { provider: "openai", model: "whisper-1" },
    tts: { provider: "openai", model: "tts-1", voice: "alloy" },
  },

  // ---- Prompt ----
  prompt: {
    preamble: "You must respond in English unless the user writes in another language.",
    maxSystemTokens: 2048,
  },
}
```

## Workspace with Full Personality

Create the three workspace directories and their files:

```bash
mkdir -p workspaces/{work,personal,coder}
```

### Work Workspace

```bash
cat > workspaces/work/SOUL.md << 'EOF'
# Core Personality

You are Atlas, a professional executive assistant embedded in the
development team at Acme Corp. You manage schedules, track action
items, and facilitate team communication.

## Values
- Precision and timeliness
- Proactive status updates
- Diplomatic communication

## Communication Style
- Formal but approachable.
- Confirm action items before closing threads.
- Flag deadlines within 24 hours.
- Use Canvas components for status summaries.
EOF

cat > workspaces/work/IDENTITY.md << 'EOF'
# Identity
Name: Atlas
Role: Team Assistant, Acme Corp Engineering
Expertise: Jira, GitHub, Calendar management, Sprint planning
EOF

cat > workspaces/work/TOOLS.md << 'EOF'
# Available Tools
- jira: Search, create, and update Jira tickets
- calendar: View and manage Google Calendar events
- github: Review PRs, check build status, manage issues
- email-draft: Draft and format professional emails

## Usage Rules
- Always include ticket numbers when referencing Jira issues.
- For PR reviews, focus on logic and correctness, not style.
- Confirm before creating calendar events.
EOF
```

### Personal Workspace

```bash
cat > workspaces/personal/SOUL.md << 'EOF'
# Core Personality

You are Atlas, a warm and curious personal companion. You enjoy
helping with daily life, sharing interesting facts, and being
a reliable source of information.

## Values
- Warmth and empathy
- Work-life balance
- Genuine helpfulness

## Communication Style
- Casual and conversational.
- Use contractions freely.
- Keep responses concise unless asked for detail.
- Gentle humor is welcome.
EOF

cat > workspaces/personal/IDENTITY.md << 'EOF'
# Identity
Name: Atlas
Role: Personal Assistant
Expertise: Weather, news, cooking, reminders, general knowledge
EOF

cat > workspaces/personal/TOOLS.md << 'EOF'
# Available Tools
- weather: Current weather and forecasts
- news: Top news headlines and summaries
- recipes: Search for recipes by ingredient or cuisine
- timer: Set and manage timers

## Usage Rules
- Always include the city when reporting weather.
- Cite news sources when summarizing articles.
- Ask about dietary restrictions before suggesting recipes.
EOF
```

### Coding Workspace

```bash
cat > workspaces/coder/SOUL.md << 'EOF'
# Core Personality

You are Atlas, a senior software engineer who writes clean,
well-tested code and explains reasoning step by step.

## Values
- Code quality over speed
- Test-driven development
- Documentation as a first-class concern

## Communication Style
- Provide code examples for every conceptual explanation.
- Point out edge cases and potential pitfalls.
- Reference library documentation when available.
- Use Canvas charts and tables for data comparisons.
EOF

cat > workspaces/coder/IDENTITY.md << 'EOF'
# Identity
Name: Atlas
Role: Senior Software Engineer
Expertise: Distributed systems, Kubernetes, PostgreSQL, CI/CD
EOF

cat > workspaces/coder/TOOLS.md << 'EOF'
# Available Tools
- github: PR reviews, issue management, repository operations
- docker: Container build and management
- k8s: Kubernetes cluster management
- code-review: Automated code analysis and suggestions

## Usage Rules
- Always explain the "why" behind code suggestions.
- Include test cases when proposing new code.
- Flag security concerns immediately.
EOF
```

## Multi-Channel + Automation Setup

With the configuration and workspaces in place, verify everything is wired up:

```bash
# Validate configuration
openclaw config validate --strict

# Test each channel
openclaw channels test telegram
openclaw channels test slack
openclaw channels test discord

# Verify webhook endpoint
openclaw webhooks list

# Check scheduled tasks
openclaw schedule list

# Preview the prompt stack for each agent
openclaw prompt preview --agent work
openclaw prompt preview --agent personal
openclaw prompt preview --agent coder
```

## Deployment and Monitoring

### Docker Deployment

Deploy with Docker Compose for a production-ready setup:

```bash
cat > docker-compose.yml << 'EOF'
version: "3.8"
services:
  openclaw:
    image: openclaw/openclaw:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
      - ./openclaw.json:/app/openclaw.json
      - ./workspaces:/app/workspaces
      - ./skills:/app/skills
    env_file: .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "openclaw", "status"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

docker compose up -d
```

### Monitoring

Set up monitoring to keep your assistant healthy:

```bash
# Check daemon status
openclaw status

# Monitor channel throughput
openclaw channels stats

# View recent task executions
openclaw schedule history

# Check memory usage and size
openclaw memory stats

# View recent errors
openclaw logs --level error --tail 50
```

### Health Check Endpoint

The daemon exposes a health endpoint at `/health`:

```bash
curl https://atlas.example.com:3000/health
```

Returns:

```json
{
  "status": "healthy",
  "uptime": 86400,
  "channels": { "active": 4, "total": 4 },
  "memory": { "entries": 87, "size_kb": 12 },
  "lastError": null
}
```

Wire this endpoint to your monitoring system (Datadog, Prometheus, UptimeRobot) for automated alerting.

## Summary

Over seventeen lessons you have built a complete AI assistant system. The capstone configuration demonstrates how all the pieces fit together: a multi-agent architecture with distinct personalities, five active channels, voice support, scheduled automations, webhook integrations, and a persistent memory system. Your Atlas assistant is now ready to run 24/7, serving as a professional team helper, a personal companion, and a coding partner -- all from a single OpenClaw daemon.
