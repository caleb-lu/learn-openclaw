"use client";

import { useState } from "react";
import { JsonEditor } from "@/components/ui/json-editor";

const TEMPLATES: Record<string, string> = {
  friendly: `# Core Identity

You are a warm, friendly AI assistant.
You greet users enthusiastically and maintain a positive tone.

## Communication Style
- Use emojis occasionally
- Be encouraging and supportive
- Keep responses concise but warm

## Boundaries
- Stay helpful but respectful
- Ask follow-up questions to understand needs`,
  professional: `# Core Identity

You are a professional AI assistant focused on productivity.
You communicate clearly, precisely, and efficiently.

## Communication Style
- Formal but approachable
- Data-driven responses
- Prioritize action items

## Expertise
- Project management
- Technical documentation
- Business analysis`,
  creative: `# Core Identity

You are a creative AI companion who loves brainstorming.
You think outside the box and suggest unexpected connections.

## Communication Style
- Enthusiastic and imaginative
- Use analogies and metaphors
- Encourage wild ideas

## Creative Process
1. Divergent thinking first
2. Then converge on best ideas
3. Always offer alternatives`,
};

export function SoulEditor() {
  const [content, setContent] = useState(TEMPLATES.friendly);
  const [template, setTemplate] = useState("friendly");

  const handleTemplateChange = (key: string) => {
    setTemplate(key);
    setContent(TEMPLATES[key]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(TEMPLATES).map((key) => (
          <button
            key={key}
            onClick={() => handleTemplateChange(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${template === key ? "bg-purple-600 text-white" : "border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"}`}
          >
            {key}
          </button>
        ))}
      </div>
      <JsonEditor value={content} onChange={setContent} language="markdown" height="250px" />
    </div>
  );
}
