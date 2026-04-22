# Lesson 10: Memory System

OpenClaw includes a built-in memory system that lets your assistant remember facts, preferences, and context across sessions. Instead of starting every conversation from scratch, the assistant can recall important details from previous interactions. This lesson covers the memory file structure, daily snapshots, automatic recall, and decay strategies.

## Learning Objectives

- Understand the MEMORY.md structure and format
- Configure daily memory snapshots
- Use automatic recall mechanisms
- Manage memory decay and pruning
- Optimize context injection strategies

## Prerequisites

- Completion of Lesson 9 (Prompt Engineering)
- A workspace directory with at least SOUL.md

## MEMORY.md Structure

`MEMORY.md` is a special workspace file that OpenClaw reads and writes automatically. Unlike SOUL.md and IDENTITY.md, which you edit manually, MEMORY.md is maintained by the framework. Its structure uses Markdown headings and bullet lists for machine-readable organization:

```markdown
# Memory

## Facts

- User prefers dark mode in all applications
- User's primary programming language is Python
- User works at Acme Corp as a backend engineer
- User's timezone is America/New_York (UTC-5)

## Preferences

- Likes concise answers with code examples
- Prefers morning check-ins between 8-9 AM
- Does not like unsolicited recommendations

## Ongoing Projects

- Migrating auth-service from JWT to session cookies (started 2026-03-15)
- Building a CLI tool for Kubernetes log aggregation

## Key Decisions

- 2026-04-01: Chose PostgreSQL over MongoDB for the new analytics service
- 2026-03-20: Decided to use Redis for session caching
```

The daemon writes new entries to MEMORY.md at the end of each session if the conversation produced noteworthy facts. It does not store every message -- only information that passes a relevance filter.

## Daily Memory Snapshots

OpenClaw can create daily snapshots of memory to track how your assistant's knowledge evolves over time. Snapshots are stored in the `workspace/memory/` directory:

```
workspace/
  MEMORY.md               # Current active memory (always up to date)
  memory/
    2026-04-20.md         # Snapshot from April 20
    2026-04-21.md         # Snapshot from April 21
    2026-04-22.md         # Snapshot from April 22
```

Configure snapshot frequency in `openclaw.json`:

```json5
{
  memory: {
    enabled: true,
    snapshots: {
      enabled: true,
      frequency: "daily",       // "daily" | "hourly" | "per-session"
      retention: 30,            // Keep the last 30 snapshots
    },
  },
}
```

Snapshots serve two purposes: they provide a historical record you can audit, and they enable the memory diff feature that shows what your assistant learned each day:

```bash
# Show what changed in memory today
openclaw memory diff --today

# Show memory changes over the past week
openclaw memory diff --days 7

# Export all memory as JSON for analysis
openclaw memory export --format json > memory-export.json
```

## Automatic Recall Mechanisms

Memory recall is the process of selectively injecting relevant memory entries into the prompt stack (Layer 3). OpenClaw uses a keyword-based relevance engine to decide which memories to include:

1. **Extract keywords** from the current user message.
2. **Score each memory entry** based on keyword overlap and recency.
3. **Inject the top N entries** into the prompt, where N is configurable.

```json5
{
  memory: {
    recall: {
      maxEntries: 10,           // Maximum memory entries per request
      minScore: 0.3,            // Minimum relevance score (0.0 - 1.0)
      recencyBoost: 0.2,        // Score bonus for entries less than 7 days old
      decayRate: 0.05,          // How much score drops per day of age
    },
  },
}
```

For example, if a user says "How is the auth migration going?", the recall engine extracts the keywords "auth" and "migration", finds the matching memory entry about the JWT-to-session-cookie migration, and injects it into the prompt. The assistant can then give a contextually aware response.

### Manual Recall

You can also manually query memory from the CLI:

```bash
# Search memory for a specific topic
openclaw memory search "database"

# List all memory entries with their scores
openclaw memory list --scores

# Add a memory entry manually
openclaw memory add "User's dog is named Rocky"
```

## Memory Decay and Pruning

Without pruning, MEMORY.md would grow indefinitely and consume too many tokens in the prompt stack. OpenClaw implements two decay strategies:

### Time-Based Decay

Memory entries lose relevance score as they age. The `decayRate` parameter controls how fast this happens:

- A `decayRate` of 0.05 means an entry loses 5% of its score per day.
- After 20 days, an entry that initially scored 1.0 would score approximately 0.36.
- Entries that fall below `minScore` are no longer recalled automatically.

### Explicit Pruning

Configure automatic pruning to remove low-value entries:

```json5
{
  memory: {
    pruning: {
      enabled: true,
      maxEntries: 200,          // Maximum entries before pruning triggers
      minRecallCount: 2,        // Entry must be recalled at least N times to survive
      maxAge: "90d",            // Remove entries older than 90 days
    },
  },
}
```

Pruning runs daily at midnight (or at a configured time) and archives removed entries to a separate file rather than deleting them permanently:

```
workspace/
  memory/
    archive/
      pruned-2026-04-22.md    # Entries removed on April 22
```

## Context Injection Strategies

The way memory is injected into the prompt affects how well the assistant uses it. OpenClaw supports three injection strategies:

### Strategy 1: Full Injection (default)

All recalled entries are injected as a single system message:

```
[System] Relevant memory:
- User prefers dark mode in all applications
- Migrating auth-service from JWT to session cookies
```

This is simple and works well when the number of recalled entries is small (under 10).

### Strategy 2: Categorized Injection

Entries are grouped by category and injected as separate messages:

```
[System] User preferences: dark mode, concise answers
[System] Active projects: auth-service migration, K8s log CLI
```

This helps the model distinguish between different types of information.

### Strategy 3: Inline Injection

Memory entries are woven into the user message as contextual notes:

```json5
{
  memory: {
    recall: {
      strategy: "inline",     // "full" | "categorized" | "inline"
    },
  },
}
```

Configure the strategy based on your model's behavior. Some models handle categorized injection better, while others prefer everything in a single system message.

## Summary

The memory system transforms your assistant from a stateless chatbot into an entity that learns and remembers. MEMORY.md stores facts, preferences, and project details. Daily snapshots track changes over time. Automatic recall injects relevant memories into the prompt, and decay/pruning keeps memory size manageable. In the next lesson we will explore the skill system, starting with installing skills from ClawHub.
