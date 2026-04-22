# Lesson 11: Skill Installation

Skills are modular capability packages that extend your assistant's functionality. They can add new tools (weather lookup, code execution, database queries), new channels (SMS, voice), or new behaviors (scheduled reports, automated workflows). This lesson covers the ClawHub marketplace and how to install and configure published skills.

## Learning Objectives

- Browse and search the ClawHub marketplace
- Understand the SKILL.md format specification
- Install skills via the CLI
- Configure installed skills
- Explore popular community skills

## Prerequisites

- Completion of Lesson 10 (Memory System)
- A running OpenClaw daemon with internet access

## ClawHub Marketplace Overview

ClawHub is the central registry for OpenClaw skills. It hosts both official skills maintained by the OpenClaw team and community-contributed skills. Every skill on ClawHub has a unique identifier, a version number, and a quality score.

```bash
# Search for skills
openclaw hub search weather

# List all available skills
openclaw hub list

# Get details about a specific skill
openclaw hub info @openclaw/weather

# Install a skill
openclaw hub install @openclaw/weather

# Install a specific version
openclaw hub install @openclaw/weather@2.1.0

# Update all installed skills
openclaw hub update

# Uninstall a skill
openclaw hub uninstall @openclaw/weather
```

ClawHub skills follow semantic versioning. When you install without specifying a version, the latest stable release is used. The `update` command checks for newer versions of all installed skills and prompts before upgrading.

## SKILL.md Format Specification

Every skill is packaged with a `SKILL.md` file that describes its capabilities, required configuration, and usage instructions. This file is automatically added to the prompt stack (Layer 4) when the skill is loaded. Here is the format:

```markdown
---
name: weather
version: 2.1.0
author: OpenClaw Team
description: Retrieve current weather and forecasts for any city.
license: MIT
tags: [utility, weather, api]
---

# Weather Skill

## Description

Provides real-time weather data including temperature, humidity,
wind speed, and 5-day forecasts for cities worldwide.

## Configuration

| Key         | Type   | Required | Default       |
|-------------|--------|----------|---------------|
| apiKey      | string | yes      | --            |
| units       | string | no       | metric        |
| language    | string | no       | en            |
| cacheTTL    | number | no       | 300 (seconds) |

## Available Tools

### get_weather

Retrieves the current weather for a given city.

**Parameters:**
- `city` (string, required): City name or postal code
- `units` (string, optional): "metric" or "imperial"

**Example invocation:**
```
get_weather(city="Tokyo", units="metric")
```

### get_forecast

Returns a 5-day weather forecast.

**Parameters:**
- `city` (string, required): City name
- `days` (number, optional): Number of forecast days (1-7)

## Usage Guidelines

- Always include the city name in your response for clarity.
- When the user asks about "weather" without specifying a city, ask which city.
- Cache results for 5 minutes to avoid redundant API calls.
```

The YAML frontmatter (between `---` delimiters) contains metadata that ClawHub uses for indexing and the daemon uses for validation. The Markdown body provides the actual instructions that get injected into the prompt stack.

## Installing Skills via CLI

The `openclaw hub install` command downloads the skill package and places it in your project's `skills/` directory:

```
learn-openclaw/
  openclaw.json
  workspace/
  skills/
    weather/
      SKILL.md
      index.js          # Optional: skill implementation
      package.json      # Optional: npm dependencies
    timer/
      SKILL.md
      index.js
```

For skills that include JavaScript implementations, the daemon automatically installs any npm dependencies listed in the skill's `package.json`:

```bash
# Install a skill with dependencies
openclaw hub install @openclaw/github

# The daemon will run npm install in the skill directory
# Dependencies: @octokit/rest, uuid
```

After installation, register the skill in `openclaw.json`:

```json5
{
  agents: [
    {
      id: "default",
      workspace: "./workspace",
      skills: ["weather", "timer", "github"],
    },
  ],
}
```

Only skills listed in the agent's `skills` array are loaded. This lets you assign different skills to different agents.

## Skill Configuration

Skills often require configuration values such as API keys. These are provided in the skill's section of `openclaw.json`:

```json5
{
  skills: {
    weather: {
      apiKey: "${OPENWEATHER_API_KEY}",
      units: "metric",
      cacheTTL: 600,
    },
    github: {
      token: "${GITHUB_PERSONAL_ACCESS_TOKEN}",
      defaultOwner: "my-org",
    },
  },
}
```

Configuration values are interpolated with environment variables using the same `${VAR}` syntax as the rest of the configuration. If a required configuration key is missing, the daemon logs a warning and the skill is loaded in a degraded mode (the tool is listed in TOOLS.md but calls will fail gracefully).

## Popular Community Skills

Here are some of the most popular skills on ClawHub:

| Skill                 | Description                                    |
|-----------------------|------------------------------------------------|
| `@openclaw/weather`   | Current weather and forecasts                  |
| `@openclaw/timer`     | Set, list, and cancel timers                   |
| `@openclaw/github`    | GitHub issues, PRs, and repository management  |
| `@openclaw/calendar`  | Google Calendar integration                    |
| `@openclaw/news`      | RSS news aggregation and summarization         |
| `@openclaw/translate` | Multi-language translation                     |
| `@openclaw/image`     | Image generation and analysis                  |
| `@openclaw/sentiment` | Text sentiment analysis                        |
| `@community/jira`     | Jira ticket management                         |
| `@community/spotify`  | Spotify playback control                       |

To view the full catalog, run `openclaw hub list` or visit the ClawHub website.

## Summary

Skills extend your assistant's capabilities through a modular package system. ClawHub provides a marketplace for discovering and installing skills. Each skill ships with a SKILL.md that documents its tools and configuration. After installing a skill, register it in the agent's `skills` array and provide any required configuration values. In the next lesson we will write a custom skill from scratch.
