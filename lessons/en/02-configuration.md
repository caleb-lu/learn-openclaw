# Lesson 2: Configuration Deep Dive

The `openclaw.json` file is the single source of truth for your AI assistant. It defines which LLM to use, what channels to expose, how agents are organized, and when scheduled tasks fire. This lesson covers every core parameter and the JSON5 syntax that makes configuration more ergonomic.

## Learning Objectives

- Understand the complete structure of `openclaw.json`
- Leverage JSON5 features for cleaner configuration
- Configure core parameters: name, model, channels, and agents
- Override configuration values with environment variables
- Validate your configuration before deploying

## Prerequisites

- Completion of Lesson 1 (Installation & Deployment)
- A running OpenClaw daemon

## openclaw.json Structure

A minimal `openclaw.json` looks like this:

```json5
{
  // The assistant's display name
  name: "Atlas",

  // Primary LLM configuration
  model: {
    provider: "openai",
    name: "gpt-4o",
    temperature: 0.7,
  },

  // Channel definitions
  channels: {
    webchat: { enabled: true },
  },

  // Agent definitions (at least one required)
  agents: [
    {
      id: "default",
      workspace: "./workspace",
    },
  ],
}
```

Every field has sensible defaults, so you can start with just a `name` and a `model.provider` and grow the file incrementally. The daemon watches this file for changes and hot-reloads most settings without a restart.

## JSON5 Syntax Advantages

OpenClaw uses JSON5 instead of plain JSON for its configuration file. JSON5 is a strict superset of JSON that adds several developer-friendly features:

- **Trailing commas** are allowed, reducing diff noise when you add or remove entries.
- **Comments** (`//` single-line and `/* */` multi-line) let you document inline.
- **Unquoted keys** save keystrokes for simple identifiers.
- **Single-quoted strings** are valid, matching JavaScript conventions.
- **Multi-line strings** via backticks are useful for long prompts.

```json5
{
  name: "Atlas",
  version: 1,           // trailing comma is fine

  /* Multi-line comment explaining
     the model selection rationale */
  model: {
    provider: "anthropic",
    name: "claude-sonnet-4-20250514",
    temperature: 0.6,
  },

  // Use single quotes if you prefer
  description: 'A helpful assistant for developers',
}
```

If you accidentally write invalid JSON5, the daemon logs a detailed parse error with line and column numbers.

## Core Parameters

### name

The `name` field is a string used as the assistant's identity in channel greetings, log messages, and the WebChat header. It does not affect model behavior but is important for user-facing branding.

### model

The `model` object selects the LLM and tunes its behavior:

```json5
model: {
  provider: "openai",        // "openai" | "anthropic" | "ollama" | "google"
  name: "gpt-4o",            // model identifier
  temperature: 0.7,          // 0.0 (deterministic) to 1.0 (creative)
  maxTokens: 4096,           // max response length
  systemPrompt: "You are Atlas, a concise coding assistant.",
}
```

The `provider` field determines which SDK is loaded under the hood. Each provider reads its own API key from a corresponding environment variable (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.).

### channels

The `channels` object maps channel identifiers to their configuration:

```json5
channels: {
  webchat: { enabled: true },
  telegram: {
    enabled: true,
    token: "${TELEGRAM_BOT_TOKEN}",
  },
  discord: {
    enabled: true,
    webhookUrl: "${DISCORD_WEBHOOK_URL}",
  },
}
```

Each channel has its own set of required and optional fields, which are covered in depth in Lessons 5 and 6.

### agents

The `agents` array defines one or more agent instances, each with its own workspace directory, routing rules, and skill set:

```json5
agents: [
  {
    id: "default",
    workspace: "./workspace",
    skills: ["timer", "weather"],
    schedule: "./schedule.json5",
  },
]
```

Multi-agent setups are explored fully in Lesson 8.

## Environment Variables

OpenClaw supports `${VAR_NAME}` interpolation anywhere in `openclaw.json`. At startup the daemon replaces these placeholders with values from the process environment or from a `.env` file in the project root:

```bash
# .env file
OPENAI_API_KEY=sk-proj-abc123
TELEGRAM_BOT_TOKEN=7123456789:AAH...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

This pattern keeps secrets out of version control while keeping the configuration file portable. If a referenced variable is missing, the daemon logs a warning and the affected channel or feature is disabled.

## Configuration Validation

Before deploying, validate your configuration file without starting the full daemon:

```bash
openclaw config validate
```

This command checks for required fields, valid provider names, reachable channel endpoints, and correct JSON5 syntax. It prints a summary table:

```
✓ JSON5 syntax valid
✓ Model provider "openai" recognized
✓ Channel "webchat" configuration valid
✓ Channel "telegram" token present
✗ Channel "discord" webhook URL not set
  1 error, 4 warnings
```

Run `openclaw config validate --strict` to treat warnings as errors if you want CI/CD pipeline enforcement.

## Summary

You now understand the full structure of `openclaw.json`, the benefits of JSON5 syntax, and how to manage secrets with environment variables. You also know how to validate your configuration before going live. In the next lesson we will explore the workspace directory and the personality files that give your assistant its character.
