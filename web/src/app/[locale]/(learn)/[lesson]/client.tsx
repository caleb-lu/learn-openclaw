"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Play, Code2, Beaker, Microscope,
  ChevronRight, RotateCcw, CheckCircle2,
} from "lucide-react";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonNav } from "@/components/layout/lesson-nav";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { DocRenderer } from "@/components/lesson/doc-renderer";
import { CodeBlock } from "@/components/ui/code-block";
import { LessonVisualization } from "@/components/visualizations";
import { useSimulator } from "@/hooks/useSimulator";
import { useI18n } from "@/lib/i18n";
import { LESSON_META, type LessonSlug, type Locale } from "@/lib/constants";
import type { Scenario } from "@/types/lesson-data";

const TABS_CONFIG = [
  { id: "learn", labelKey: "learn", icon: BookOpen },
  { id: "simulate", labelKey: "simulate", icon: Play },
  { id: "code", labelKey: "code", icon: Code2 },
  { id: "playground", labelKey: "playground", icon: Beaker },
  { id: "deepDive", labelKey: "deepDive", icon: Microscope },
];

interface LessonClientProps {
  locale: Locale;
  slug: LessonSlug;
  content: string;
  scenario: Record<string, unknown> | null;
}

export function LessonClient({
  locale,
  slug,
  content,
  scenario: scenarioData,
}: LessonClientProps) {
  const [activeTab, setActiveTab] = useState("learn");
  const { messages } = useI18n();
  const msgs = messages as Record<string, Record<string, string>>;
  const meta = LESSON_META[slug];
  const scenario = scenarioData as Scenario | null;
  const simulator = useSimulator(scenario);

  const tabs = TABS_CONFIG.map((t) => ({
    id: t.id,
    label: msgs.tabs?.[t.labelKey] ?? t.labelKey,
    icon: <t.icon size={16} />,
  }));

  return (
    <div>
      <LessonHeader slug={slug} locale={locale} />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {/* Learn Tab */}
          <TabPanel activeTab={activeTab} tabId="learn">
            <DocRenderer content={content} />
          </TabPanel>

          {/* Simulate Tab */}
          <TabPanel activeTab={activeTab} tabId="simulate">
            <SimulatorPanel simulator={simulator} />
          </TabPanel>

          {/* Code Tab */}
          <TabPanel activeTab={activeTab} tabId="code">
            <CodeTab slug={slug} />
          </TabPanel>

          {/* Playground Tab */}
          <TabPanel activeTab={activeTab} tabId="playground">
            <PlaygroundTab slug={slug} locale={locale} />
          </TabPanel>

          {/* Deep Dive Tab */}
          <TabPanel activeTab={activeTab} tabId="deepDive">
            <LessonVisualization slug={slug} />
          </TabPanel>
        </motion.div>
      </AnimatePresence>

      <LessonNav currentSlug={slug} locale={locale} />
    </div>
  );
}

function SimulatorPanel({
  simulator,
}: {
  simulator: ReturnType<typeof useSimulator>;
}) {
  return (
    <div className="space-y-4">
      {simulator.scenario && (
        <div className="rounded-lg border border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]">
          <h3 className="font-semibold mb-1">{simulator.scenario.title}</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {simulator.scenario.description}
          </p>
        </div>
      )}

      {simulator.currentStep && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 p-4">
          <p className="font-medium text-sm">
            Step {simulator.currentStepIndex + 1}: {simulator.currentStep.instruction}
          </p>
          {simulator.currentStep.expectedOutput && (
            <pre className="mt-2 text-xs bg-[var(--code-bg)] rounded p-2 overflow-x-auto">
              {simulator.currentStep.expectedOutput}
            </pre>
          )}
        </div>
      )}

      {simulator.outputs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[var(--text-secondary)]">Output History</h4>
          {simulator.outputs.map((out, i) => (
            <pre key={i} className="text-xs bg-[var(--code-bg)] rounded p-2 overflow-x-auto">
              {out}
            </pre>
          ))}
        </div>
      )}

      {simulator.isComplete ? (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={18} />
          <span className="font-medium">
            {simulator.scenario?.completionMessage ?? "Simulation complete!"}
          </span>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={simulator.nextStep}
            disabled={!simulator.currentStep}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={14} />
            Next Step
          </button>
          <button
            onClick={simulator.reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function CodeTab({ slug }: { slug: LessonSlug }) {
  const meta = LESSON_META[slug];
  const codeSamples = getCodeSamples(slug);

  if (codeSamples.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <Code2 size={40} className="mx-auto mb-3 opacity-40" />
        <p>No code samples for this lesson yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {codeSamples.map((sample) => (
        <CodeBlock
          key={sample.id}
          code={sample.content}
          language={sample.language}
          filename={sample.filename}
        />
      ))}
    </div>
  );
}

function getCodeSamples(slug: string) {
  const samples: Record<string, Array<{ id: string; filename: string; language: string; content: string }>> = {
    "01-installation": [
      { id: "docker", filename: "terminal", language: "bash", content: 'docker pull openclaw/gateway\ndocker run -d -p 18789:18789 -v ~/.openclaw:/root/.openclaw openclaw/gateway' },
      { id: "npm", filename: "terminal", language: "bash", content: 'npm install -g @openclaw/cli\nopenclaw init\nopenclaw start' },
      { id: "verify", filename: "terminal", language: "bash", content: 'openclaw --version\nopenclaw status\nopenclaw doctor' },
    ],
    "02-configuration": [
      { id: "config", filename: "openclaw.json5", language: "json5", content: '{\n  name: "my-assistant",\n  model: {\n    provider: "openai",\n    model: "gpt-4o",\n    temperature: 0.7,\n  },\n  channels: [\n    { type: "cli", enabled: true },\n    { type: "webchat", enabled: true, config: { port: 3000 } },\n  ],\n}' },
    ],
    "03-workspace": [
      { id: "soul", filename: "SOUL.md", language: "markdown", content: "# Core Identity\n\nYou are a helpful, knowledgeable AI assistant.\nYou communicate clearly and concisely.\nYou proactively offer relevant suggestions.\n\n## Values\n- Accuracy over speed\n- Helpful and friendly tone\n- Admit uncertainty when unsure" },
      { id: "identity", filename: "IDENTITY.md", language: "markdown", content: 'name: "MyAssistant"\ntone: friendly professional\nexpertise: general knowledge, coding, productivity\nlanguage: en, zh' },
      { id: "tools", filename: "TOOLS.md", language: "markdown", content: "# Available Tools\n\n- web_search: Search the web for information\n- calculator: Perform mathematical calculations\n- file_read: Read file contents\n- file_write: Write to files\n- terminal: Execute shell commands" },
    ],
    "09-prompt-engineering": [
      { id: "layers", filename: "prompt-stack", language: "text", content: "Layer 1: System Base Prompt (model defaults)\nLayer 2: openclaw.json systemPrompt\nLayer 3: SOUL.md content\nLayer 4: IDENTITY.md content\nLayer 5: TOOLS.md content\nLayer 6: MEMORY.md context\nLayer 7: SKILL.md instructions (active skills)\nLayer 8: User message + conversation history" },
    ],
    "13-scheduled-tasks": [
      { id: "cron", filename: "openclaw.json5 (excerpt)", language: "json5", content: 'automation: [\n  {\n    name: "morning-briefing",\n    trigger: { type: "cron", expression: "0 8 * * 1-5" },\n    action: { type: "chat", message: "Morning briefing", channel: "cli" },\n  },\n  {\n    name: "hourly-check",\n    trigger: { type: "every", interval: "1h" },\n    action: { type: "chat", message: "Any updates?" },\n  },\n]' },
    ],
  };
  return samples[slug] ?? [];
}

function PlaygroundTab({ slug, locale }: { slug: LessonSlug; locale: Locale }) {
  const meta = LESSON_META[slug];
  const features: string[] = [];

  if (meta.hasConfigEditor) features.push("ConfigEditor");
  if (meta.hasChannelFlow) features.push("ChannelFlow");
  if (meta.hasSoulWorkshop) features.push("SoulWorkshop");
  if (meta.hasSkillPlayground) features.push("SkillPlayground");
  if (meta.hasPromptStack) features.push("PromptStack");
  if (meta.hasMemoryDemo) features.push("MemoryDemo");
  if (meta.hasCanvasPreview) features.push("CanvasPreview");
  if (meta.hasAutomation) features.push("AutomationLibrary");

  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        {locale === "zh"
          ? "此课程的交互式组件。连接本地 Gateway 以启用实时功能。"
          : "Interactive components for this lesson. Connect your local Gateway for live features."}
      </p>
      {features.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((name) => (
            <div
              key={name}
              className="rounded-lg border border-dashed border-[var(--border-color)] p-4 text-center"
            >
              <Beaker size={24} className="mx-auto mb-2 text-[var(--text-secondary)]" />
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {locale === "zh" ? "交互式组件" : "Interactive component"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <Beaker size={40} className="mx-auto mb-3 opacity-40" />
          <p>No interactive playground for this lesson.</p>
        </div>
      )}
    </div>
  );
}
