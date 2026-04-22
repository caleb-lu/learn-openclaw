"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface RoutingRule {
  id: number;
  pattern: string;
  channel: string;
  agent: string;
  priority: number;
  enabled: boolean;
}

const DEFAULT_RULES: RoutingRule[] = [
  { id: 1, pattern: "code:*", channel: "slack", agent: "coder", priority: 1, enabled: true },
  { id: 2, pattern: "help:*", channel: "telegram", agent: "assistant", priority: 2, enabled: true },
  { id: 3, pattern: "*:*", channel: "*", agent: "default", priority: 99, enabled: true },
];

export function RoutingTable() {
  const [rules, setRules] = useState(DEFAULT_RULES);

  const toggleRule = (id: number) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Pattern</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Channel</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Agent</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Priority</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Status</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-b border-[var(--border-color)]">
              <td className="py-2 px-3 font-mono text-xs">{rule.pattern}</td>
              <td className="py-2 px-3">{rule.channel}</td>
              <td className="py-2 px-3">{rule.agent}</td>
              <td className="py-2 px-3">{rule.priority}</td>
              <td className="py-2 px-3">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    rule.enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                  )}
                >
                  {rule.enabled ? "Active" : "Disabled"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
