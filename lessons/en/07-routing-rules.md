# Lesson 7: Routing Rules

Routing rules determine how incoming messages are matched to agents and handlers. OpenClaw uses a five-layer binding table that evaluates rules in priority order, from broad patterns to specific triggers. This lesson explains the routing system and shows you how to build context-aware routing configurations.

## Learning Objectives

- Understand the 5-layer binding table architecture
- Write pattern matching rules with glob and regex syntax
- Configure priority-based rule evaluation
- Route messages to specific agents based on channel and content
- Build context-aware routing for complex multi-agent setups

## Prerequisites

- Completion of Lesson 6 (Multi-Channel Coordination)
- At least two agents configured (see Lesson 8 for multi-agent setup basics)

## The 5-Layer Binding Table

When a message arrives on any channel, OpenClaw passes it through five evaluation layers. The first layer that produces a match determines the handler:

| Layer | Name              | Scope                          |
|-------|-------------------|--------------------------------|
| 1     | Channel Default   | Every message on a channel     |
| 2     | User Allowlist    | Messages from known users      |
| 3     | Pattern Match     | Content matching glob/regex    |
| 4     | Keyword Trigger   | Exact keyword or command       |
| 5     | Fallback          | Catch-all for unmatched messages |

Layers are evaluated in order from 1 to 5. A match at layer 3 stops evaluation -- layers 4 and 5 are skipped. This design lets you set broad defaults and override them with increasingly specific rules.

## Pattern Matching Syntax

OpenClaw supports two pattern syntaxes for routing rules:

### Glob Patterns

Glob patterns use shell-style wildcards and are ideal for simple content matching:

```json5
{
  routing: [
    {
      pattern: "hello*",
      agent: "greeter",
      channel: "telegram",
    },
    {
      pattern: "*bug*",
      agent: "support",
      priority: 10,
    },
  ],
}
```

- `*` matches zero or more characters
- `?` matches exactly one character
- `[abc]` matches any character in the set

Glob matching is case-insensitive by default.

### Regular Expressions

For more complex matching, use regex patterns by prefixing the pattern with `regex:`:

```json5
{
  routing: [
    {
      pattern: "regex:^(help|support|issue)\\s+.*",
      agent: "support",
      priority: 20,
    },
    {
      pattern: "regex:\\b(deploy|release|rollback)\\b",
      agent: "devops",
      channel: "discord",
    },
  ],
}
```

Regex patterns use JavaScript RegExp syntax. Remember to escape backslashes in JSON5 strings.

## Priority Rules

When multiple rules could match the same message, the `priority` field controls which one wins. Higher numbers are evaluated first. If two rules have the same priority, the one defined later in the array takes precedence.

```json5
{
  routing: [
    // Low priority: broad catch-all
    {
      pattern: "*",
      agent: "default",
      priority: 1,
    },
    // Medium priority: any message containing "code"
    {
      pattern: "*code*",
      agent: "coder",
      priority: 10,
    },
    // High priority: exact command
    {
      pattern: "/deploy",
      agent: "devops",
      priority: 100,
    },
  ],
}
```

In this example, the message "deploy the code" matches all three rules. Because the `/deploy` rule has the highest priority (100), it wins. If the message were "show me the code," the `*code*` rule (priority 10) would win over the catch-all (priority 1).

## Channel-Agent Routing

You can restrict routing rules to specific channels using the `channel` field:

```json5
{
  routing: [
    // Telegram messages go to the personal assistant
    {
      channel: "telegram",
      pattern: "*",
      agent: "personal",
      priority: 1,
    },
    // Discord messages in #support go to the support agent
    {
      channel: "discord",
      pattern: "*",
      agent: "support",
      priority: 1,
      metadata: { discordChannel: "#support" },
    },
    // Slack mentions go to the work agent
    {
      channel: "slack",
      pattern: "*",
      agent: "work",
      priority: 1,
    },
  ],
}
```

The `metadata` field passes channel-specific context to the agent. In this example, the Discord rule only fires for messages in the `#support` channel. Other Discord channels fall through to the default agent.

## Context-Aware Routing Examples

Here are a few practical routing configurations that demonstrate the power of the binding table:

### Language Detection

Route messages to a language-specific agent based on detected script:

```json5
{
  routing: [
    {
      pattern: "regex:[\\u3040-\\u30ff\\u4e00-\\u9faf]",
      agent: "japanese-assistant",
      priority: 50,
    },
    {
      pattern: "regex:[\\u0400-\\u04ff]",
      agent: "russian-assistant",
      priority: 50,
    },
  ],
}
```

### Time-Based Routing

Route to a different agent based on the time of day:

```json5
{
  routing: [
    {
      pattern: "*",
      agent: "work-agent",
      priority: 10,
      condition: {
        timeRange: { start: "09:00", end: "17:00", timezone: "America/New_York" },
      },
    },
    {
      pattern: "*",
      agent: "casual-agent",
      priority: 5,
    },
  ],
}
```

During business hours (9 AM to 5 PM Eastern), messages go to the work agent. Outside those hours, the casual agent handles conversations.

### Sentiment-Based Routing

Combine routing with a sentiment analysis skill to escalate frustrated users:

```json5
{
  routing: [
    {
      pattern: "*",
      agent: "escalation",
      priority: 100,
      condition: {
        skill: "sentiment",
        threshold: { negative: 0.8 },
      },
    },
  ],
}
```

Messages with a negative sentiment score above 0.8 are routed to an escalation agent trained for de-escalation.

## Summary

The routing system gives you fine-grained control over how messages flow through your OpenClaw deployment. The five-layer binding table evaluates rules by priority, supports glob and regex patterns, and can incorporate channel, time, and skill-based conditions. In the next lesson we will build on this by setting up multiple agents with distinct personalities and workspaces.
