# Lesson 14: Webhooks

Webhooks let external systems push events into your OpenClaw assistant in real time. Unlike scheduled tasks that run on a timer, webhooks are event-driven -- they fire when something happens in an external service. This lesson covers endpoint configuration, security, and integration patterns for common services.

## Learning Objectives

- Configure HTTP webhook endpoints in OpenClaw
- Understand the event-driven architecture
- Secure webhooks with signatures and authentication
- Handle request and response formats
- Integrate with GitHub and Stripe

## Prerequisites

- Completion of Lesson 13 (Scheduled Tasks)
- A publicly accessible URL (or a tunnel like ngrok for development)

## HTTP Endpoint Configuration

OpenClaw exposes a generic webhook endpoint that accepts HTTP POST requests. Any service that can send HTTP payloads can trigger your assistant:

```json5
{
  webhooks: {
    enabled: true,
    prefix: "/hooks",            // Base URL path for all webhooks
    endpoints: [
      {
        name: "github-events",
        path: "github",          // Full path: /hooks/github
        agent: "coder",
        secret: "${GITHUB_WEBHOOK_SECRET}",
      },
      {
        name: "stripe-events",
        path: "stripe",
        agent: "work",
        secret: "${STRIPE_WEBHOOK_SECRET}",
      },
    ],
  },
}
```

The daemon registers these endpoints at startup:

```
Webhooks:
  POST /hooks/github   -> agent "coder"
  POST /hooks/stripe   -> agent "work"
```

Incoming requests are validated against the configured secret, parsed, and forwarded to the specified agent as a system-triggered message.

## Event-Driven Architecture

The webhook pipeline processes every request through these stages:

```
HTTP Request --> Authentication --> Parsing --> Prompt Assembly --> LLM Call --> Response --> HTTP Response
```

1. **Authentication** verifies the request signature.
2. **Parsing** extracts structured data from the request body.
3. **Prompt Assembly** builds the prompt stack with workspace files and the webhook payload as context.
4. **LLM Call** sends the assembled prompt to the model.
5. **Response** returns the LLM's output as the HTTP response body (or posts it to a channel).

The LLM receives the webhook payload formatted as Markdown in the user message:

```markdown
[Webhook: github-events]

## Event: push

### Repository
- Name: openclaw/core
- Branch: main
- Committer: alice

### Commits
- abc1234: Fix memory leak in session manager
- def5678: Add webhook rate limiting
```

This structured format helps the LLM understand the event and generate a relevant response.

## Webhook Security

### HMAC Signature Verification

Most webhook providers sign their payloads with an HMAC. OpenClaw verifies signatures automatically when a `secret` is configured:

```json5
{
  webhooks: {
    endpoints: [
      {
        name: "github-events",
        path: "github",
        secret: "${GITHUB_WEBHOOK_SECRET}",
        signatureHeader: "X-Hub-Signature-256",   // Header containing the signature
        signatureAlgorithm: "sha256",               // HMAC algorithm
      },
    ],
  },
}
```

If the signature does not match, the daemon returns HTTP 401 and logs the rejected request. No LLM call is made for unauthenticated requests.

### API Key Authentication

For services that use API keys instead of HMAC signatures:

```json5
{
  webhooks: {
    endpoints: [
      {
        name: "custom-webhook",
        path: "custom",
        auth: {
          type: "bearer",
          token: "${CUSTOM_WEBHOOK_TOKEN}",
        },
      },
    ],
  },
}
```

### IP Allowlisting

Restrict which IP addresses can send webhook requests:

```json5
{
  webhooks: {
    global: {
      allowedIPs: ["192.30.252.0/22", "185.199.108.0/22"],   // GitHub IP ranges
    },
  },
}
```

## Request/Response Format

### Incoming Request

```
POST /hooks/github HTTP/1.1
Content-Type: application/json
X-Hub-Signature-256: sha256=abc123...

{
  "event": "push",
  "repository": { "name": "openclaw/core", "branch": "main" },
  "commits": [...]
}
```

### Outgoing Response

By default, the LLM's response is returned as JSON:

```json
{
  "status": "ok",
  "message": "Push received for openclaw/core on main. Two commits detected: memory leak fix and webhook rate limiting.",
  "agent": "coder",
  "tokens": 342
}
```

You can customize the response format and add channel forwarding:

```json5
{
  webhooks: {
    endpoints: [
      {
        name: "github-events",
        path: "github",
        agent: "coder",
        responseFormat: "text",              // "json" | "text" | "none"
        forwardTo: "discord",                // Also post to a channel
        forwardToChannel: "#github-events",  // Discord channel name
      },
    ],
  },
}
```

## Integration Examples

### GitHub

GitHub sends push, pull request, issue, and other events as webhooks:

```json5
{
  webhooks: {
    endpoints: [
      {
        name: "github-events",
        path: "github",
        agent: "coder",
        secret: "${GITHUB_WEBHOOK_SECRET}",
        events: ["push", "pull_request", "issues"],    // Only process these events
        forwardTo: "slack",
        forwardToChannel: "#dev-activity",
      },
    ],
  },
}
```

Set the webhook URL in your GitHub repository settings to `https://your-domain.com:3000/hooks/github`.

### Stripe

Stripe sends payment and subscription events:

```json5
{
  webhooks: {
    endpoints: [
      {
        name: "stripe-events",
        path: "stripe",
        agent: "work",
        secret: "${STRIPE_WEBHOOK_SECRET}",
        signatureHeader: "Stripe-Signature",
        responseFormat: "none",        // Acknowledge silently, post to channel
        forwardTo: "slack",
        forwardToChannel: "#billing",
        events: ["payment_intent.succeeded", "invoice.payment_failed"],
      },
    ],
  },
}
```

The `events` filter ensures only relevant Stripe events trigger LLM calls. Other events are acknowledged with a 200 response but not processed further.

## Summary

Webhooks provide a real-time bridge between external services and your OpenClaw assistant. Configuration is straightforward: define an endpoint path, assign an agent, and set up authentication. The daemon handles signature verification, payload parsing, and prompt assembly automatically. Combined with channel forwarding, webhooks enable powerful automation pipelines. In the next lesson we will explore the Canvas and A2UI system for pushing rich visual content to users.
