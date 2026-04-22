"use client";
import { useState } from "react";
import { Clock, Globe, Search } from "lucide-react";

interface AutomationTemplate {
  id: string;
  name: string;
  type: "cron" | "webhook";
  trigger: string;
  description: string;
  config: string;
}

const TEMPLATES: AutomationTemplate[] = [
  { id: "daily-summary", name: "Daily Summary", type: "cron", trigger: "0 9 * * *", description: "Generate daily task summary", config: '{ name: "daily-summary", trigger: { type: "cron", expression: "0 9 * * *" }, action: { type: "chat", message: "Summarize today\'s tasks" } }' },
  { id: "github-pr", name: "GitHub PR Review", type: "webhook", trigger: "POST /webhook/github", description: "Auto-review pull requests", config: '{ name: "github-pr", trigger: { type: "webhook", path: "/webhook/github" }, action: { type: "skill", skill: "github-pr-review" } }' },
  { id: "morning-brief", name: "Morning Briefing", type: "cron", trigger: "0 8 * * 1-5", description: "Weekday morning briefings", config: '{ name: "morning-brief", trigger: { type: "cron", expression: "0 8 * * 1-5" }, action: { type: "chat", message: "Good morning!" } }' },
  { id: "schedule-check", name: "Schedule Check", type: "cron", trigger: "*/30 * * * *", description: "Check upcoming events every 30min", config: '{ name: "schedule-check", trigger: { type: "cron", expression: "*/30 * * * *" }, action: { type: "skill", skill: "calendar-check" } }' },
  { id: "health-check", name: "Health Check", type: "cron", trigger: "*/5 * * * *", description: "Monitor system health", config: '{ name: "health-check", trigger: { type: "cron", expression: "*/5 * * * *" }, action: { type: "execute", command: "openclaw status" } }' },
  { id: "webhook-generic", name: "Generic Webhook", type: "webhook", trigger: "POST /webhook/event", description: "Handle any webhook event", config: '{ name: "webhook-generic", trigger: { type: "webhook", path: "/webhook/event" }, action: { type: "process", handler: "event-handler" } }' },
];

export function AutomationLibrary() {
  const [filter, setFilter] = useState<"all" | "cron" | "webhook">("all");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCopy = (config: string) => {
    navigator.clipboard.writeText(config);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search automations..." className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] pl-9 pr-3 py-2 text-sm" />
        </div>
        {(["all", "cron", "webhook"] as const).map((type) => (
          <button key={type} onClick={() => setFilter(type)} className={`rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors ${filter === type ? "bg-amber-600 text-white" : "border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"}`}>
            {type}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((template) => (
          <div key={template.id} className="rounded-lg border border-[var(--border-color)] p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {template.type === "cron" ? <Clock size={14} className="text-amber-500" /> : <Globe size={14} className="text-blue-500" />}
                <span className="font-medium text-sm">{template.name}</span>
              </div>
              <span className="text-xs font-mono text-[var(--text-secondary)]">{template.trigger}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{template.description}</p>
            <button onClick={() => handleCopy(template.config)} className="text-xs text-blue-500 hover:text-blue-600">Copy Config</button>
          </div>
        ))}
      </div>
    </div>
  );
}
