# Lesson 4: Your First Conversation

Now that your assistant is configured and its workspace is populated, it is time to talk to it. OpenClaw provides two primary interfaces for conversation: the CLI chat mode and the browser-based WebChat. This lesson walks you through both and explains how sessions, context, and message types work under the hood.

## Learning Objectives

- Start and use the CLI chat interface
- Access the WebChat interface in a browser
- Manage conversation sessions
- Understand how context is maintained across turns
- Distinguish between user, assistant, and system message types

## Prerequisites

- Completion of Lesson 3 (Workspace & Personality)
- A running OpenClaw daemon

## CLI Chat Interface

The fastest way to talk to your assistant is the built-in CLI chat. It runs in your terminal and connects to the daemon over a local WebSocket:

```bash
# Start an interactive chat session
openclaw chat

# Chat with a specific agent
openclaw chat --agent default

# Send a single message and exit
openclaw chat --send "What is the capital of France?"
```

Once inside the interactive prompt, type your message and press Enter. The assistant streams its response token by token:

```
[you] Hello, Atlas. Can you explain what a Kubernetes pod is?

[Atlas] A pod is the smallest deployable unit in Kubernetes.
It represents one or more containers that share network and
storage resources. Think of it as a wrapper around your
containers that ensures they run together on the same node.
```

Press `Ctrl+C` to exit the chat. The session is automatically saved and can be resumed later.

### CLI Flags

| Flag               | Description                          |
|--------------------|--------------------------------------|
| `--agent <id>`     | Target a specific agent by ID        |
| `--session <id>`   | Resume an existing session           |
| `--send <msg>`     | Send one message and print the reply |
| `--no-stream`      | Wait for the full response before printing |
| `--verbose`        | Show prompt stack and token counts   |

## WebChat Interface

WebChat is a browser-based chat UI that runs on the same HTTP server as the daemon. By default it is available at `http://localhost:3000/chat`.

Open your browser and navigate to that URL. You will see a clean chat interface with:

- A message history panel on the left
- An input field at the bottom
- A session selector in the top-right corner
- A settings panel accessible via the gear icon

WebChat supports markdown rendering in responses, syntax highlighting for code blocks, and file attachment previews. It also exposes the full session management API, so you can switch between sessions or create new ones without leaving the browser.

## Session Management

Every conversation belongs to a session. Sessions isolate context, so messages from one session do not leak into another. This is important when you are working on multiple topics simultaneously.

```bash
# List all sessions
openclaw sessions list

# Create a new session with a label
openclaw sessions create --label "project-planning"

# Resume a specific session
openclaw chat --session abc123

# Export a session as Markdown
openclaw sessions export abc123 --format md > session.md
```

Sessions are stored in the daemon's data directory. Each session contains the full message history, timestamps, token usage counts, and the agent ID that handled the conversation. When a session exceeds the model's context window, OpenClaw automatically summarizes older messages to make room for new ones.

## Conversation Context

Context is how the assistant remembers what was said earlier in the session. OpenClaw manages context in three layers:

1. **Workspace files** (SOUL.md, IDENTITY.md, TOOLS.md) are always present as the system prompt.
2. **Session history** includes all prior user and assistant messages in the current session.
3. **Memory injection** pulls relevant entries from `MEMORY.md` when the user's message matches stored topics.

When the total token count approaches the model's limit, OpenClaw uses a sliding window combined with automatic summarization. The most recent messages are kept verbatim, while older messages are compressed into a summary paragraph that preserves key facts and decisions.

## Message Types and Responses

OpenClaw distinguishes three message types in its internal protocol:

- **User messages** are what you type. They are sent to the LLM as `role: "user"`.
- **Assistant messages** are the LLM's replies, sent as `role: "assistant"`.
- **System messages** are injected by the framework (workspace files, memory, tool results) as `role: "system"`.

In addition to plain text, assistant messages can include structured content:

```json5
{
  role: "assistant",
  content: "Here is the weather in Tokyo:\n\n" +
           "Temperature: 18 C\nCondition: Partly cloudy",
  tools: [
    { name: "weather", input: { city: "Tokyo" }, output: "18C, partly cloudy" }
  ],
  canvas: null,    // set to a canvas ID to push A2UI content
}
```

Tool invocations are visible in the `--verbose` CLI mode and in the WebChat debug panel, so you can always trace how the assistant arrived at its answer.

## Summary

You have now conversed with your assistant through both the CLI and WebChat interfaces. You understand how sessions isolate conversations, how context is managed across turns, and what message types flow through the system. In the next lesson we will connect external channels so your assistant can talk to the world beyond your terminal.
