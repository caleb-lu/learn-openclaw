# Lesson 13: Scheduled Tasks

Scheduled tasks allow your assistant to perform actions automatically at defined intervals. Whether you need a daily morning briefing, weekly summaries, or periodic health checks, OpenClaw's task scheduler handles it. This lesson covers the three scheduling syntaxes, timezone handling, and monitoring.

## Learning Objectives

- Use `at`, `every`, and `cron` scheduling syntaxes
- Define tasks in `openclaw.json`
- Handle timezone conversions correctly
- Understand task execution context
- Monitor and debug scheduled tasks

## Prerequisites

- Completion of Lesson 12 (Custom Skills)
- A running OpenClaw daemon

## at / every / cron Syntax

OpenClaw supports three scheduling syntaxes, each suited to different use cases:

### at: One-Time Tasks

The `at` syntax schedules a task to run once at a specific time:

```json5
{
  schedule: [
    {
      name: "welcome-message",
      at: "2026-04-23T09:00:00",
      timezone: "America/New_York",
      agent: "default",
      message: "Good morning! Here is your daily briefing...",
    },
  ],
}
```

After execution, one-time tasks are automatically removed from the schedule.

### every: Fixed Intervals

The `every` syntax runs a task repeatedly at a fixed interval:

```json5
{
  schedule: [
    {
      name: "health-check",
      every: "30m",            // Every 30 minutes
      agent: "default",
      message: "Run a system health check and report any issues.",
    },
    {
      name: "hourly-summary",
      every: "1h",             // Every hour
      agent: "work",
      message: "Summarize the last hour of activity.",
      channel: "slack",
    },
  ],
}
```

Supported interval units:

| Unit | Description  |
|------|--------------|
| `s`  | Seconds      |
| `m`  | Minutes      |
| `h`  | Hours        |
| `d`  | Days         |
| `w`  | Weeks        |

### cron: Complex Schedules

The `cron` syntax uses standard cron expressions for complex recurring schedules:

```json5
{
  schedule: [
    {
      name: "morning-briefing",
      cron: "0 9 * * 1-5",     // 9 AM, Monday through Friday
      timezone: "America/New_York",
      agent: "work",
      message: "Create a morning briefing with calendar events, pending Jira tickets, and weather.",
      channel: "slack",
    },
    {
      name: "weekly-review",
      cron: "0 17 * * 5",      // 5 PM every Friday
      timezone: "America/New_York",
      agent: "default",
      message: "Write a weekly review summarizing completed tasks, decisions made, and goals for next week.",
      channel: "email",
    },
    {
      name: "memory-prune",
      cron: "0 0 * * *",       // Midnight every day
      agent: "default",
      action: "memory.prune",   // Built-in action instead of LLM message
    },
  ],
}
```

Cron fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, where 0 is Sunday).

## Task Definition in openclaw.json

Tasks can be defined in two locations: inline in `openclaw.json` or in a separate schedule file referenced from the agent configuration.

### Inline Definition

```json5
{
  schedule: [
    {
      name: "morning-briefing",
      cron: "0 9 * * 1-5",
      timezone: "America/New_York",
      agent: "work",
      message: "Create a morning briefing.",
      channel: "slack",
      enabled: true,
      maxRetries: 3,
      timeout: 60000,             // 60 second timeout
    },
  ],
}
```

### External Schedule File

For complex setups, use a dedicated schedule file:

```json5
// openclaw.json
{
  agents: [
    {
      id: "work",
      workspace: "./workspaces/work",
      schedule: "./schedules/work.json5",
    },
  ],
}
```

```json5
// schedules/work.json5
{
  tasks: [
    {
      name: "morning-standup",
      cron: "0 9 * * 1-5",
      timezone: "America/New_York",
      message: "Generate a standup summary from recent Slack messages and Jira updates.",
      channel: "slack",
    },
    {
      name: "sprint-review",
      cron: "0 16 * * 5",
      message: "Summarize this sprint's completed stories and carry-over items.",
    },
  ],
}
```

## Timezone Handling

All scheduled tasks require an explicit timezone. OpenClaw uses the IANA timezone database (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`). If no timezone is specified, the daemon defaults to UTC and logs a warning.

```json5
{
  schedule: [
    {
      name: "tokyo-briefing",
      cron: "0 8 * * 1-5",
      timezone: "Asia/Tokyo",          // 8 AM JST
      message: "Good morning briefing for the Tokyo team.",
    },
    {
      name: "london-briefing",
      cron: "0 8 * * 1-5",
      timezone: "Europe/London",       // 8 AM GMT/BST
      message: "Good morning briefing for the London team.",
    },
  ],
}
```

Daylight saving time transitions are handled automatically by the timezone database. Tasks scheduled for 9 AM in `America/New_York` will fire at 9 AM EST or 9 AM EDT as appropriate.

## Task Execution Context

When a scheduled task fires, it runs in a special execution context:

- **No user message.** The `message` field serves as the user input for that turn.
- **Full workspace.** The agent's SOUL.md, IDENTITY.md, TOOLS.md, and MEMORY.md are all loaded.
- **No session history.** Scheduled tasks run in isolated sessions unless you specify a `sessionId`.
- **Tool access.** The agent can use all its configured tools, including skills.

```json5
{
  schedule: [
    {
      name: "daily-digest",
      cron: "0 20 * * *",
      timezone: "America/New_York",
      agent: "personal",
      message: "Check my calendar for tomorrow, summarize pending emails, and suggest what to prepare.",
      channel: "telegram",
      sessionId: "daily-digest",     // Reuse the same session each day
    },
  ],
}
```

Setting `sessionId` allows the scheduled task to accumulate context across runs. Without it, each execution starts with a blank session.

## Monitoring Scheduled Tasks

OpenClaw provides several commands for monitoring scheduled task activity:

```bash
# List all scheduled tasks with their next fire time
openclaw schedule list

# Show execution history
openclaw schedule history

# Show history for a specific task
openclaw schedule history --task morning-briefing

# Manually trigger a task
openclaw schedule run morning-briefing

# Enable or disable a task
openclaw schedule enable morning-briefing
openclaw schedule disable morning-briefing
```

The execution history includes timestamps, duration, success/failure status, and the LLM's response for each run. Failed tasks are retried up to `maxRetries` times with exponential backoff.

## Summary

Scheduled tasks bring automation to your OpenClaw assistant. The `at` syntax handles one-time events, `every` handles fixed intervals, and `cron` handles complex recurring patterns. Tasks run with full workspace context and can post to any configured channel. In the next lesson we will explore webhooks, which allow external systems to trigger your assistant in real time.
