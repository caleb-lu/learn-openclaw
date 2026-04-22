# Lesson 3: Workspace & Personality

The workspace is where your assistant's identity lives. It is a directory containing Markdown files that OpenClaw automatically loads into the prompt stack before every conversation turn. By editing these files you control how your assistant speaks, what expertise it claims, and which tools it can use.

## Learning Objectives

- Understand the role of each workspace file (SOUL.md, IDENTITY.md, TOOLS.md)
- Create a workspace from scratch
- Customize personality, tone, and expertise
- Define tool permissions and constraints

## Prerequisites

- Completion of Lesson 2 (Configuration Deep Dive)

## Workspace Overview

A workspace is simply a directory referenced by the `workspace` field in an agent's configuration. The daemon scans this directory for specific filenames and loads them in a defined order:

```
workspace/
  SOUL.md        # Layer 1: Core personality and values
  IDENTITY.md    # Layer 2: Name, tone, and domain expertise
  TOOLS.md       # Layer 3: Available tools and usage rules
  MEMORY.md      # Layer 4: Persistent memory (auto-managed)
  SKILL.md       # Layer 5+: Per-skill instruction files
```

Each file is optional. If a file does not exist, that layer is simply skipped. You can add custom Markdown files with any name, and they will be loaded alphabetically as additional layers.

## SOUL.md: Core Personality

`SOUL.md` defines the deepest layer of your assistant's character. It is the first thing injected into the prompt, so it sets the foundation for everything else. Write it as if you are describing the person you want your assistant to be.

```markdown
# Core Personality

You are Atlas, a pragmatic and curious software engineer who loves
building systems that are simple, reliable, and well-tested.

## Values

- Clarity over cleverness
- Working code over perfect abstractions
- Honest assessments over flattery

## Communication Style

- Use short paragraphs and bullet lists.
- When giving code, always explain the "why" behind the approach.
- Admit uncertainty instead of guessing.
```

Keep `SOUL.md` focused on personality traits and values. Domain-specific knowledge belongs in `IDENTITY.md`.

## IDENTITY.md: Name, Tone, Expertise

`IDENTITY.md` layers on top of `SOUL.md` to add concrete identity details and expertise boundaries:

```markdown
# Identity

Name: Atlas
Role: Senior Software Engineer specializing in backend systems
Languages: English (primary), Spanish (conversational)

## Expertise

- Distributed systems and microservices
- PostgreSQL performance tuning
- Kubernetes orchestration
- CI/CD pipeline design

## Tone

Professional but warm. Use first-person ("I") when sharing opinions.
Avoid jargon unless the user demonstrates familiarity with the topic.
```

The distinction between `SOUL.md` and `IDENTITY.md` matters when you start running multiple agents that share a personality but differ in expertise. You can symlink `SOUL.md` across agent workspaces while giving each agent a unique `IDENTITY.md`.

## TOOLS.md: Available Tools and Permissions

`TOOLS.md` tells the assistant which tools and skills it has access to and how it should use them:

```markdown
# Available Tools

## Built-in

- **web_search**: Search the web for current information.
- **code_run**: Execute Python or Node.js snippets in a sandbox.
- **file_read / file_write**: Read and write files in the workspace.

## Installed Skills

- **weather**: Retrieve current weather for a given city.
- **timer**: Set, list, and cancel timers.

## Usage Rules

- Always confirm before executing code that writes to disk.
- Use web_search when the user's question involves events after
  your training cutoff.
- Do not expose file paths to channel users.
```

When you install a new skill (Lesson 11), its instruction file is automatically registered here or merged into the prompt stack by the daemon.

## Creating a Basic Workspace

Run the following commands to scaffold a workspace from scratch:

```bash
# From your OpenClaw project root
mkdir -p workspace

cat > workspace/SOUL.md << 'EOF'
# Core Personality

You are a helpful, concise assistant. Answer directly and
follow up with brief explanations when needed.
EOF

cat > workspace/IDENTITY.md << 'EOF'
# Identity

Name: Helper
Role: General-purpose AI assistant
EOF

cat > workspace/TOOLS.md << 'EOF'
# Available Tools

- **web_search**: Search the web.
- **code_run**: Execute code in a sandbox.
EOF
```

After creating these files, restart the daemon or let it hot-reload. You can verify the loaded workspace with:

```bash
openclaw prompt preview
```

This prints the assembled prompt stack so you can see exactly what the LLM receives.

## Personality Customization Tips

Crafting a good personality takes iteration. Here are some practical guidelines:

1. **Start small.** Write two or three sentences in `SOUL.md` and test the assistant in WebChat. Add complexity only when the baseline feels wrong.
2. **Be explicit about negatives.** LLMs respond well to "do not" instructions. For example, "Do not use emojis in responses" or "Do not volunteer unsolicited advice."
3. **Use concrete examples.** Instead of "be concise," write "keep responses under three sentences unless the user asks for detail."
4. **Separate concerns.** Put personality in `SOUL.md`, factual identity in `IDENTITY.md`, and tool rules in `TOOLS.md`. This makes it easy to swap pieces independently.
5. **Version your workspace.** Because workspace files are plain Markdown, they work well with git. Track changes and revert experiments that do not pan out.

## Summary

The workspace directory is the heart of your assistant's character. `SOUL.md` defines values and communication style, `IDENTITY.md` adds expertise and tone, and `TOOLS.md` constrains tool usage. Together they form the first layers of the prompt stack. In the next lesson you will have your first conversation and see these files in action.
