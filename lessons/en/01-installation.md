# Lesson 1: Installation & Deployment

OpenClaw is a modular AI agent framework that runs as a persistent daemon on your server or local machine. This lesson walks you through every way to install it, verify the installation, and get your first gateway daemon running.

## Learning Objectives

- Install OpenClaw using Docker or npm
- Start the gateway daemon and confirm it is healthy
- Run CLI verification commands to check system status
- Understand hardware and software system requirements

## Prerequisites

- A machine running Linux, macOS, or Windows with WSL2
- Node.js 18+ (for npm installation) or Docker 20+ (for Docker installation)
- An API key for at least one LLM provider (e.g., OpenAI, Anthropic)

## System Requirements

OpenClaw is lightweight but benefits from modern hardware. The following table summarizes the baseline recommendations:

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU      | 1 core  | 2+ cores    |
| RAM      | 512 MB  | 2 GB+       |
| Disk     | 100 MB  | 500 MB+     |
| Node.js  | 18.x    | 20.x LTS    |

No GPU is required because all inference is handled by remote LLM providers. The daemon itself primarily orchestrates HTTP connections, parses prompts, and manages state.

## Docker Installation

Docker is the recommended installation method for production deployments. It provides process isolation, reproducible builds, and straightforward updates.

```bash
# Pull the latest image
docker pull openclaw/openclaw:latest

# Create a persistent data volume
docker volume create openclaw-data

# Run the gateway daemon
docker run -d \
  --name openclaw \
  -v openclaw-data:/data \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-your-key-here \
  openclaw/openclaw:latest
```

The `-v openclaw-data:/data` flag ensures your configuration files, workspace, and memory persist across container restarts. Port 3000 exposes the built-in web chat and webhook endpoints.

To update to a newer version later, stop the container, pull the new image, and start it again with the same volume mount:

```bash
docker stop openclaw && docker rm openclaw
docker pull openclaw/openclaw:latest
docker run -d --name openclaw -v openclaw-data:/data -p 3000:3000 openclaw/openclaw:latest
```

## npm Installation

For development or when you want direct access to the filesystem without Docker layers, install OpenClaw globally via npm:

```bash
# Install the CLI globally
npm install -g @openclaw/cli

# Verify the binary is available
openclaw --version

# Initialize a new project in the current directory
openclaw init my-assistant
cd my-assistant
```

The `openclaw init` command scaffolds a project directory containing `openclaw.json`, a `workspace/` folder with starter personality files, and a `skills/` directory. After initialization, start the daemon with:

```bash
openclaw daemon start
```

By default the daemon listens on `http://localhost:3000`. You can override this with the `PORT` environment variable or the `server.port` field in `openclaw.json`.

## Gateway Daemon Startup

Regardless of installation method, the daemon performs the same startup sequence:

1. **Load configuration** from `openclaw.json` (or `.openclaw/openclaw.json`).
2. **Mount workspace** files (SOUL.md, IDENTITY.md, etc.) into the prompt stack.
3. **Register channels** (Telegram, Discord, Slack, WebChat, and any installed skill channels).
4. **Connect to LLM providers** and validate API keys.
5. **Start the HTTP server** for WebChat, webhooks, and the Canvas endpoint.
6. **Initialize scheduled tasks** and memory recall system.

You should see a startup banner confirming each step. If any step fails, the daemon logs the error and exits with a non-zero code.

## CLI Verification Commands

After the daemon is running, use these commands to verify everything is wired up correctly:

```bash
# Check daemon health
openclaw status

# List registered channels
openclaw channels list

# Test LLM connectivity
openclaw ping llm

# View the assembled prompt stack
openclaw prompt preview

# Open an interactive chat session
openclaw chat
```

The `openclaw status` command returns a JSON object with the daemon uptime, active channel count, memory usage, and last error timestamp. If any of these commands return unexpected results, consult the troubleshooting guide in the official documentation.

## Summary

In this lesson you installed OpenClaw via Docker or npm, started the gateway daemon, and ran verification commands. You now have a running AI agent framework ready for configuration. In the next lesson we will dive deep into the `openclaw.json` configuration file and explore JSON5 syntax.
