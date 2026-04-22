"use client";

import { useState, useCallback } from "react";

const TEMPLATES: Record<string, string> = {
  weather: `---
name: weather-lookup
triggers:
  - pattern: "weather in (.+)"
    description: "Get weather for a city"
  - pattern: "what's the weather like"
    description: "General weather query"
---

# Weather Lookup Skill

Get the current weather and forecast for any location.

## Instructions

1. Extract the city name from the user's trigger match
2. Call the weather API with the city name
3. Format the response with temperature, conditions, and forecast

## Response Format

\`\`\`
Weather in [city]:
- Temperature: [temp]F / [temp]C
- Conditions: [conditions]
- Humidity: [humidity]%
- Wind: [wind] mph
\`\`\`
`,
  notification: `---
name: send-notification
triggers:
  - pattern: "notify (.+)"
    description: "Send a notification to someone"
  - pattern: "remind me to (.+)"
    description: "Set a reminder"
---

# Notification Skill

Send notifications and reminders through configured channels.

## Instructions

1. Parse the recipient and message from the trigger
2. Determine the appropriate channel (email, push, SMS)
3. Format the message based on the channel
4. Queue the notification for delivery

## Response Format

\`\`\`
Notification sent:
- To: [recipient]
- Channel: [channel]
- Message: [message]
- Status: queued
\`\`\`
`,
  custom: `---
name: my-custom-skill
triggers:
  - pattern: "your trigger pattern here"
    description: "Description of what this trigger matches"
---

# My Custom Skill

Describe what this skill does here.

## Instructions

1. Step one
2. Step two
3. Step three

## Response Format

Describe the expected output format.
`,
};

interface SkillEditorProps {
  onChange: (content: string) => void;
}

export function SkillEditor({ onChange }: SkillEditorProps) {
  const [template, setTemplate] = useState<string>("weather");
  const [content, setContent] = useState(TEMPLATES.weather);

  const handleTemplateChange = useCallback(
    (key: string) => {
      setTemplate(key);
      const newContent = TEMPLATES[key] ?? "";
      setContent(newContent);
      onChange(newContent);
    },
    [onChange]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      setContent(value);
      onChange(value);
    },
    [onChange]
  );

  const lineCount = content.split("\n").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Skill Editor</h3>
        <div className="flex gap-1">
          {(["weather", "notification", "custom"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTemplateChange(t)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                template === t
                  ? "bg-blue-600 text-white"
                  : "border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] overflow-hidden pointer-events-none">
          <div className="pt-3 pr-2 text-right">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="text-[10px] leading-[20px] text-[var(--text-secondary)] font-mono">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[360px] pl-12 pr-3 py-3 bg-transparent text-sm font-mono leading-[20px] text-[var(--text-primary)] resize-none focus:outline-none"
          placeholder="Write your SKILL.md content here..."
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        <span>{lineCount} lines</span>
        <span className="w-px h-3 bg-[var(--border-color)]" />
        <span>YAML frontmatter + Markdown</span>
      </div>
    </div>
  );
}
