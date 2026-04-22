"use client";

import { useState } from "react";
import { JsonEditor } from "@/components/ui/json-editor";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const MINIMAL_CONFIG = `{
  name: "playground-assistant",
  model: {
    provider: "openai",
    model: "gpt-4o",
  },
  channels: [
    { type: "cli", enabled: true },
    { type: "webchat", enabled: true },
  ],
}`;

export default function PlaygroundPage() {
  const [config, setConfig] = useState(MINIMAL_CONFIG);
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {locale === "zh" ? "实验室" : "Playground"}
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        {locale === "zh"
          ? "在这里实验 OpenClaw 配置、工作空间和技能"
          : "Experiment with OpenClaw configurations, workspaces, and skills here"}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Config Editor */}
        <div className="space-y-4">
          <Card>
            <CardTitle>{locale === "zh" ? "配置编辑器" : "Config Editor"}</CardTitle>
            <CardDescription>
              {locale === "zh"
                ? "编辑 openclaw.json5 配置文件"
                : "Edit your openclaw.json5 configuration"}
            </CardDescription>
          </Card>
          <JsonEditor
            value={config}
            onChange={setConfig}
            language="json5"
            height="400px"
          />
        </div>

        {/* Workspace Editor */}
        <div className="space-y-4">
          <Card>
            <CardTitle>{locale === "zh" ? "工作空间预览" : "Workspace Preview"}</CardTitle>
            <CardDescription>
              {locale === "zh"
                ? "编辑 SOUL.md 定义 AI 人格"
                : "Edit SOUL.md to define AI personality"}
            </CardDescription>
          </Card>
          <JsonEditor
            value={`# My AI Assistant\n\nYou are a helpful and knowledgeable assistant.\nYou respond concisely and accurately.\n\n## Personality\n- Friendly and approachable\n- Expert in technology\n- Patient with explanations`}
            onChange={() => {}}
            language="markdown"
            height="400px"
          />
        </div>
      </div>

      {/* Skill Template */}
      <div className="mt-6 space-y-4">
        <Card>
          <CardTitle>{locale === "zh" ? "技能模板" : "Skill Template"}</CardTitle>
          <CardDescription>
            {locale === "zh"
              ? "自定义技能模板，修改后保存为 SKILL.md"
              : "Custom skill template — save as SKILL.md after editing"}
          </CardDescription>
        </Card>
        <JsonEditor
          value={`---
name: my-skill
version: 1.0.0
description: A custom skill
triggers:
  - pattern: "{command}"
    parameters:
      command: string
---

# My Skill

Describe what this skill does here.

## Usage
- "my-skill hello"
- "my-skill status"

## Implementation
Steps the skill performs when triggered.`}
          onChange={() => {}}
          language="markdown"
          height="300px"
        />
      </div>
    </div>
  );
}
