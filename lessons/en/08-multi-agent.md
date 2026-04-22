# Lesson 8: Multi-Agent Setup

A single OpenClaw daemon can host multiple agents, each with its own personality, workspace, and skill set. Multi-agent setups are useful when you need distinct personas for different contexts -- a professional work assistant, a casual personal companion, and a specialized coding tutor, all running under one roof.

## Learning Objectives

- Understand the agent concept and isolation model
- Configure multiple agents in `openclaw.json`
- Create distinct work/life/coding agent personas
- Switch between agents programmatically and via routing
- Assign agent-specific workspace files and skills

## Prerequisites

- Completion of Lesson 7 (Routing Rules)
- Familiarity with workspace files (Lesson 3)

## Agent Concept and Isolation

An agent in OpenClaw is an independent processing unit with its own:

- **Workspace directory** containing SOUL.md, IDENTITY.md, TOOLS.md, and MEMORY.md
- **Skill set** determining which tools and capabilities are available
- **Session store** isolating conversation history from other agents
- **Schedule** for automated tasks
- **Routing rules** that direct messages to this agent

Agents share the same LLM configuration and channel adapters but otherwise operate in complete isolation. A message processed by one agent never sees the workspace files or session history of another.

## Multiple Agent Configuration

Define multiple agents in the `agents` array in `openclaw.json`:

```json5
{
  agents: [
    {
      id: "work",
      name: "Atlas (Work)",
      workspace: "./workspaces/work",
      skills: ["jira", "calendar", "email-draft"],
      schedule: "./schedules/work.json5",
      model: {
        provider: "anthropic",
        name: "claude-sonnet-4-20250514",
        temperature: 0.3,   // Lower temperature for professional tone
      },
    },
    {
      id: "personal",
      name: "Atlas (Personal)",
      workspace: "./workspaces/personal",
      skills: ["weather", "news", "recipes"],
      schedule: "./schedules/personal.json5",
      model: {
        provider: "openai",
        name: "gpt-4o",
        temperature: 0.8,   // Higher temperature for casual conversation
      },
    },
    {
      id: "coder",
      name: "Atlas (Coding)",
      workspace: "./workspaces/coder",
      skills: ["github", "docker", "k8s", "code-review"],
      schedule: null,       // No scheduled tasks for this agent
    },
  ],
}
```

Each agent can use a different LLM provider and model, or override temperature and other generation parameters. This lets you use a cheaper, faster model for simple tasks and a more capable model for complex reasoning.

## Work/Life/Coding Agent Personas

Creating distinct personas starts with the workspace files. Here is an example of how three agents differ:

### Work Agent -- workspace/work/SOUL.md

```markdown
# Core Personality

You are Atlas, a professional executive assistant. You help
manage schedules, draft communications, and track action items.

## Values

- Precision and timeliness
- Diplomatic communication
- Proactive status updates

## Communication Style

- Formal but approachable.
- Always confirm action items before closing a thread.
- Flag deadlines that are within 24 hours.
```

### Personal Agent -- workspace/personal/SOUL.md

```markdown
# Core Personality

You are Atlas, a friendly and curious companion. You enjoy
discussing books, movies, cooking, and travel.

## Values

- Warmth and empathy
- Genuine curiosity
- Work-life balance advocacy

## Communication Style

- Casual and conversational. Use contractions freely.
- Share recommendations with brief personal anecdotes.
- Gentle humor is welcome.
```

### Coding Agent -- workspace/coder/SOUL.md

```markdown
# Core Personality

You are Atlas, a senior software engineer. You write clean,
well-tested code and explain your reasoning step by step.

## Values

- Code quality over speed
- Test-driven development
- Documentation as a first-class concern

## Communication Style

- Provide code examples for every conceptual explanation.
- Point out edge cases and potential pitfalls.
- Reference specific library documentation when available.
```

## Agent Switching

Users can switch agents in several ways:

### Via CLI

```bash
# Chat with a specific agent
openclaw chat --agent personal

# Switch agent mid-session
/agent work
```

### Via Routing Rules

The routing system (Lesson 7) directs messages to agents based on patterns:

```json5
{
  routing: [
    { channel: "slack", pattern: "*", agent: "work", priority: 10 },
    { channel: "telegram", pattern: "*", agent: "personal", priority: 10 },
    { pattern: "regex:\\b(code|debug|refactor)\\b", agent: "coder", priority: 50 },
  ],
}
```

### Via WebChat

The WebChat UI includes a dropdown in the top-right corner that lists all configured agents. Clicking an agent name switches the active conversation to that agent immediately.

## Agent-Specific Workspace Files

Each agent reads its workspace files from its own directory. The directory layout is identical for every agent:

```
workspaces/
  work/
    SOUL.md
    IDENTITY.md
    TOOLS.md
    MEMORY.md
    schedule.json5
  personal/
    SOUL.md
    IDENTITY.md
    TOOLS.md
    MEMORY.md
    schedule.json5
  coder/
    SOUL.md
    IDENTITY.md
    TOOLS.md
    MEMORY.md
```

Memory is fully isolated. The work agent's `MEMORY.md` grows independently of the personal agent's memory. This means the coding agent will not accidentally reveal personal details, and the personal agent will not reference internal project information.

If you want certain files to be shared across agents, use symlinks:

```bash
# Share a common knowledge base
ln -s ../../shared/KNOWLEDGE.md workspaces/work/KNOWLEDGE.md
ln -s ../../shared/KNOWLEDGE.md workspaces/personal/KNOWLEDGE.md
```

## Summary

Multi-agent setups let you create distinct AI personas from a single OpenClaw instance. Each agent has its own workspace, skills, sessions, and optional model override. Routing rules and the CLI both support agent switching. In the next lesson we will examine the prompt stack in detail and learn how workspace files become the layers that shape every response.
