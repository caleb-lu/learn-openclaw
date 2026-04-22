# Lesson 15: Canvas & A2UI

A2UI (Agent-to-UI) is OpenClaw's system for pushing rich visual content to users. Instead of being limited to plain text responses, your assistant can render interactive cards, charts, forms, and dashboards using the Canvas rendering pipeline. This lesson explains the A2UI concept, the Canvas component types, and how to build interactive visual experiences.

## Learning Objectives

- Understand the Agent-to-UI (A2UI) concept
- Learn the Canvas rendering pipeline
- Push visual content to channels and WebChat
- Use built-in Canvas component types
- Build interactive canvases with user input

## Prerequisites

- Completion of Lesson 14 (Webhooks)
- A running OpenClaw daemon with WebChat enabled

## Agent-to-UI Concept

Traditional chatbots respond with text. OpenClaw's A2UI system allows the assistant to respond with structured visual components -- cards, tables, charts, forms, and more. These components are rendered as interactive HTML in WebChat and as rich attachments in channels that support them (Slack blocks, Telegram inline keyboards, etc.).

The A2UI flow works as follows:

1. The LLM generates a response that includes a Canvas definition.
2. The daemon validates the Canvas structure.
3. The Canvas is rendered by the channel adapter (HTML for WebChat, blocks for Slack, etc.).
4. If the Canvas includes interactive elements, user interactions are routed back to the assistant.

## Canvas Rendering Pipeline

When the LLM decides to include visual content, it outputs a special Canvas block in its response. The daemon detects this block and routes it through the rendering pipeline:

```markdown
Here is your weekly summary:

<openclaw-canvas type="card" id="weekly-summary">
{
  "title": "Weekly Summary",
  "sections": [
    {
      "heading": "Completed Tasks",
      "content": "- Auth migration (3 PRs merged)\n- Dashboard redesign (deployed)"
    },
    {
      "heading": "In Progress",
      "content": "- API rate limiting (60% complete)"
    },
    {
      "heading": "Metrics",
      "component": "bar-chart",
      "data": {
        "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
        "values": [5, 8, 3, 12, 7]
      }
    }
  ]
}
</openclaw-canvas>
```

The daemon parses the Canvas block, validates the JSON structure against the component schema, and renders it. In WebChat, this produces a styled card with a heading, bullet lists, and an embedded bar chart.

## Push Visual Content

Canvases can be pushed proactively (from scheduled tasks or webhooks) or reactively (in response to user messages).

### Reactive Canvas

When a user asks a question that benefits from visual presentation, the LLM can include a Canvas in its response. No special configuration is needed -- the TOOLS.md file simply tells the assistant that Canvas components are available:

```markdown
## Canvas Components

You have access to visual components for richer responses:
- **card**: Display titled sections with text and embedded components.
- **table**: Show structured data in rows and columns.
- **bar-chart** / **line-chart**: Render data visualizations.
- **form**: Collect structured input from the user.
- **progress**: Show progress bars for tracked items.

Use these when the user's request involves data comparison, status
tracking, or any information that is easier to understand visually.
```

### Proactive Canvas

Scheduled tasks and webhooks can push canvases to channels:

```json5
{
  schedule: [
    {
      name: "weekly-dashboard",
      cron: "0 9 * * 1",         // Every Monday at 9 AM
      timezone: "America/New_York",
      agent: "work",
      message: "Generate a weekly dashboard canvas showing project status, team activity, and key metrics.",
      channel: "slack",
      canvas: true,               // Enable canvas rendering for this task
    },
  ],
}
```

## Canvas Component Types

OpenClaw ships with several built-in component types:

### Card

A container with a title, description, and nested sections:

```json5
{
  type: "card",
  title: "Deployment Status",
  description: "Production environment health check",
  color: "green",
  sections: [
    { heading: "Services", content: "All 12 services healthy" },
    { heading: "Last Deploy", content: "2 hours ago by alice" },
  ],
}
```

### Table

Structured tabular data:

```json5
{
  type: "table",
  title: "Open Issues",
  columns: ["ID", "Title", "Priority", "Assignee"],
  rows: [
    ["#123", "Fix login redirect", "High", "bob"],
    ["#124", "Update API docs", "Medium", "carol"],
    ["#125", "Optimize queries", "Low", "dave"],
  ],
}
```

### Bar Chart

Data visualization for comparisons:

```json5
{
  type: "bar-chart",
  title: "Commits This Week",
  labels: ["Alice", "Bob", "Carol", "Dave"],
  values: [23, 18, 31, 12],
  colors: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"],
}
```

### Form

Interactive form for collecting structured input:

```json5
{
  type: "form",
  title: "New Feature Request",
  id: "feature-request-form",
  fields: [
    { name: "title", label: "Feature Title", type: "text", required: true },
    { name: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High"] },
    { name: "description", label: "Description", type: "textarea", required: true },
  ],
  submitLabel: "Submit Request",
}
```

When a user fills out and submits the form, the structured data is sent back to the assistant as a message.

### Progress

Progress bars for tracked items:

```json5
{
  type: "progress",
  title: "Sprint Progress",
  items: [
    { label: "Backend API", value: 85, color: "green" },
    { label: "Frontend UI", value: 60, color: "yellow" },
    { label: "Documentation", value: 30, color: "red" },
  ],
}
```

## Building Interactive Canvases

Interactive canvases combine multiple components and respond to user actions. Here is an example of a project dashboard that the assistant generates in response to "show me the project dashboard":

```markdown
<openclaw-canvas type="card" id="project-dashboard">
{
  "title": "Project Dashboard - Q2 2026",
  "sections": [
    {
      "heading": "Sprint Velocity",
      "component": "line-chart",
      "data": {
        "labels": ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"],
        "values": [34, 42, 38, 45]
      }
    },
    {
      "heading": "Open Pull Requests",
      "component": "table",
      "data": {
        "columns": ["PR", "Author", "Status"],
        "rows": [
          ["#201", "alice", "Under Review"],
          ["#202", "bob", "Changes Requested"],
          ["#203", "carol", "Approved"]
        ]
      }
    },
    {
      "heading": "Quick Actions",
      "component": "form",
      "data": {
        "id": "dashboard-actions",
        "fields": [
          {
            "name": "action",
            "label": "Action",
            "type": "select",
            "options": ["Create Issue", "Request Review", "Schedule Meeting"]
          }
        ],
        "submitLabel": "Go"
      }
    }
  ]
}
</openclaw-canvas>
```

When the user selects an action from the form and submits it, the assistant receives the selection and takes the appropriate next step -- creating a Jira issue, posting a review request, or scheduling a calendar event.

## Summary

The Canvas and A2UI system transforms your assistant from a text-only chatbot into a rich, interactive experience. The LLM generates Canvas definitions that the daemon renders as HTML in WebChat or native rich content in other channels. Built-in component types cover common use cases: cards, tables, charts, forms, and progress indicators. In the next lesson we will explore voice capabilities and distributed node architecture.
