# Lesson 12: Custom Skills

While ClawHub offers a growing library of pre-built skills, you will often need capabilities tailored to your specific use case. OpenClaw makes it straightforward to write custom skills using the SKILL.md format and optional JavaScript implementations. This lesson covers writing, testing, and publishing custom skills.

## Learning Objectives

- Write a SKILL.md file from scratch
- Understand YAML frontmatter fields and their purpose
- Define skill trigger patterns
- Handle parameters in skill implementations
- Publish skills to ClawHub for community use

## Prerequisites

- Completion of Lesson 11 (Skill Installation)
- Basic familiarity with Markdown and YAML

## Writing SKILL.md from Scratch

A custom skill begins with a `SKILL.md` file. Create a new directory under `skills/` in your project:

```bash
mkdir -p skills/pomodoro
```

Now create the skill definition file:

```markdown
---
name: pomodoro
version: 1.0.0
author: Your Name
description: A Pomodoro technique timer with work/break cycles.
license: MIT
tags: [productivity, timer, focus]
triggers:
  - pattern: "pomodoro*"
  - pattern: "/pomo"
---

# Pomodoro Timer Skill

## Description

Manages Pomodoro technique work sessions. Tracks work intervals
(25 minutes) and break intervals (5 minutes), and provides
session summaries at the end of each cycle.

## Available Tools

### pomo_start

Start a new Pomodoro session.

**Parameters:**
- `duration` (number, optional): Work duration in minutes (default: 25)
- `task` (string, optional): Task description for this session

### pomo_status

Get the current Pomodoro session status.

**Parameters:** None

### pomo_stop

Stop the current session and show a summary.

**Parameters:** None

## Usage Guidelines

- When the user says "start a pomodoro," call pomo_start.
- When the user asks about the timer, call pomo_status.
- At the end of a work session, remind the user to take a break.
- Track completed sessions in memory for daily summaries.
```

This SKILL.md file is sufficient for a prompt-only skill. The LLM reads the tool descriptions and usage guidelines, then generates appropriate responses without any code execution.

## YAML Frontmatter Fields

The frontmatter section (between `---` delimiters) contains metadata that the daemon and ClawHub use:

```yaml
---
name: pomodoro                # Unique skill identifier (required)
version: 1.0.0                # Semantic version (required)
author: Your Name             # Author name or handle (required)
description: A Pomodoro...    # Short description (required)
license: MIT                  # License identifier (required for publishing)
tags: [productivity, timer]   # Searchable tags
triggers:                     # Pattern triggers for routing (optional)
  - pattern: "pomodoro*"
  - pattern: "/pomo"
channel: webchat              # Restrict to specific channel (optional)
agent: default                # Restrict to specific agent (optional)
requires:                     # Other skills this depends on (optional)
  - timer
configSchema:                 # Configuration validation schema (optional)
  defaultDuration:
    type: number
    default: 25
---
```

The `triggers` field is particularly useful. When a trigger pattern matches an incoming message, OpenClaw automatically activates this skill's instructions in the prompt stack, even if the skill is not in the agent's default skill list. This enables on-demand skill activation.

## Skill Trigger Patterns

Trigger patterns use the same glob and regex syntax as routing rules (Lesson 7):

```yaml
triggers:
  # Glob patterns
  - pattern: "pomodoro*"
  - pattern: "focus*"
  # Regex patterns
  - pattern: "regex:\\b(start|stop)\\s+(a\\s+)?pomodoro"
```

When multiple skills have matching triggers, they are all loaded into the prompt stack. If you want exclusive triggering (only one skill activates per match), use the `exclusive: true` flag:

```yaml
triggers:
  - pattern: "/pomo"
    exclusive: true
```

## Parameter Handling

For skills that need code execution (beyond what the LLM can do with prompt instructions alone), create an `index.js` file alongside SKILL.md:

```javascript
// skills/pomodoro/index.js

module.exports = {
  // Called when the LLM decides to invoke the pomo_start tool
  async pomo_start(params, context) {
    const duration = params.duration || context.config.defaultDuration || 25;
    const task = params.task || "Untitled task";

    // Store session state
    context.state = {
      startTime: Date.now(),
      duration: duration,
      task: task,
      status: "running",
    };

    // Schedule a notification when the session ends
    await context.schedule(
      `pomo_end_${Date.now()}`,
      { every: `${duration}m` },
      async () => {
        context.state.status = "break";
        context.send(`Your ${duration}-minute Pomodoro session for "${task}" is complete. Time for a 5-minute break!`);
      }
    );

    return {
      message: `Started a ${duration}-minute Pomodoro session: "${task}". I will notify you when it's time for a break.`,
      state: context.state,
    };
  },

  async pomo_status(params, context) {
    if (!context.state || context.state.status !== "running") {
      return { message: "No active Pomodoro session." };
    }
    const elapsed = Math.floor((Date.now() - context.state.startTime) / 60000);
    const remaining = Math.max(0, context.state.duration - elapsed);
    return {
      message: `Session "${context.state.task}": ${remaining} minutes remaining.`,
      state: context.state,
    };
  },

  async pomo_stop(params, context) {
    if (!context.state) {
      return { message: "No active session to stop." };
    }
    const elapsed = Math.floor((Date.now() - context.state.startTime) / 60000);
    const result = context.state;
    context.state = null;
    return {
      message: `Stopped session "${result.task}" after ${elapsed} minutes.`,
    };
  },
};
```

The `context` object provides:
- `context.config` -- skill configuration from openclaw.json
- `context.state` -- persistent state across invocations
- `context.send(message)` -- send a message to the current channel
- `context.schedule(name, spec, callback)` -- register a scheduled callback
- `context.memory.add(entry)` -- add an entry to MEMORY.md

## Publishing to ClawHub

Once your skill is tested and ready, publish it to ClawHub so others can use it:

```bash
# Validate the skill package
openclaw hub validate skills/pomodoro

# Publish (requires a ClawHub account)
openclaw hub publish skills/pomodoro

# Publish a specific version
openclaw hub publish skills/pomodoro --version 1.0.0
```

Before publishing, ensure your SKILL.md has all required frontmatter fields (`name`, `version`, `author`, `description`, `license`) and that your `README.md` (optional but recommended) includes usage examples and configuration instructions.

```bash
# Create a README for your skill
cat > skills/pomodoro/README.md << 'EOF'
# Pomodoro Timer Skill

A Pomodoro technique timer for OpenClaw.

## Installation

```bash
openclaw hub install @yourname/pomodoro
```

## Configuration

```json5
{
  skills: {
    pomodoro: {
      defaultDuration: 25,
    },
  },
}
```

## Usage

Say "start a pomodoro" or use the /pomo command.
EOF
```

## Summary

Custom skills let you extend OpenClaw with capabilities specific to your workflow. A SKILL.md file with YAML frontmatter defines the skill's metadata, tools, and usage guidelines. For skills requiring code execution, an `index.js` file provides tool implementations with access to the full context API. Once polished, skills can be published to ClawHub for the community. In the next lesson we will explore scheduled tasks for automating recurring actions.
