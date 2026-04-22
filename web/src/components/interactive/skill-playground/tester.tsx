"use client";

import { useState, useCallback, useMemo } from "react";
import { Play, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SkillTesterProps {
  skillContent: string;
}

interface TestResult {
  triggerText: string;
  matchedTrigger: string | null;
  matchIndex: number | null;
  capturedGroups: string[];
  output: string;
  status: "success" | "no-match" | "error";
}

function parseSkillFrontmatter(content: string): {
  name: string;
  triggers: { pattern: string; description: string }[];
} | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  try {
    const yaml = match[1];
    const nameMatch = yaml.match(/^name:\s*(.+)$/m);
    const triggerBlocks = yaml.match(
      /triggers:\n((?:\s+-\s+pattern:\s+".*"\n\s+description:\s+".*"\n?)+)/
    );

    const name = nameMatch?.[1]?.trim() ?? "unnamed";
    const triggers: { pattern: string; description: string }[] = [];

    if (triggerBlocks) {
      const triggerRegex = /-\s+pattern:\s+"([^"]+)"\n\s+description:\s+"([^"]+)"/g;
      let m;
      while ((m = triggerRegex.exec(triggerBlocks[1])) !== null) {
        triggers.push({ pattern: m[1], description: m[2] });
      }
    }

    return { name, triggers };
  } catch {
    return null;
  }
}

function testTrigger(
  input: string,
  pattern: string
): { matched: boolean; capturedGroups: string[] } {
  try {
    // Convert simple glob-like patterns to regex
    // "weather in (.+)" becomes /weather in (.+)/
    const regexStr = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, (c) => {
        if (c === "(" || c === ")" || c === "." || c === "+" || c === "?") return c;
        return "\\" + c;
      })
      .replace(/\(([^)]+)\)/g, "($1)");

    const regex = new RegExp(regexStr, "i");
    const match = input.match(regex);
    if (match) {
      return { matched: true, capturedGroups: match.slice(1) };
    }
    return { matched: false, capturedGroups: [] };
  } catch {
    return { matched: false, capturedGroups: [] };
  }
}

function simulateExecution(
  skillName: string,
  trigger: string,
  capturedGroups: string[]
): string {
  if (skillName.includes("weather")) {
    const city = capturedGroups[0] ?? "your location";
    return `Weather in ${city}:\n- Temperature: 72F / 22C\n- Conditions: Partly Cloudy\n- Humidity: 45%\n- Wind: 8 mph`;
  }
  if (skillName.includes("notification") || skillName.includes("notify")) {
    const target = capturedGroups[0] ?? "default";
    return `Notification sent:\n- To: ${target}\n- Channel: push\n- Message: You have been notified\n- Status: queued`;
  }
  return `Executed skill "${skillName}"\nTrigger matched: "${trigger}"\nCaptured: ${capturedGroups.join(", ") || "(none)"}`;
}

export function SkillTester({ skillContent }: SkillTesterProps) {
  const [triggerInput, setTriggerInput] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const skillMeta = useMemo(() => parseSkillFrontmatter(skillContent), [skillContent]);

  const runTest = useCallback(() => {
    if (!skillMeta || !triggerInput.trim()) return;

    setIsRunning(true);

    // Simulate async execution
    setTimeout(() => {
      let matchedTrigger: string | null = null;
      let matchIndex: number | null = null;
      let capturedGroups: string[] = [];

      for (let i = 0; i < skillMeta.triggers.length; i++) {
        const test = testTrigger(triggerInput, skillMeta.triggers[i].pattern);
        if (test.matched) {
          matchedTrigger = skillMeta.triggers[i].pattern;
          matchIndex = i;
          capturedGroups = test.capturedGroups;
          break;
        }
      }

      const output = matchedTrigger
        ? simulateExecution(skillMeta.name, matchedTrigger, capturedGroups)
        : `No trigger matched for "${triggerInput}"`;

      setResult({
        triggerText: triggerInput,
        matchedTrigger,
        matchIndex,
        capturedGroups,
        output,
        status: matchedTrigger ? "success" : "no-match",
      });
      setIsRunning(false);
    }, 600);
  }, [skillMeta, triggerInput]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Skill Tester</h3>

      {/* Skill info */}
      {skillMeta && (
        <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
          <div className="text-xs text-[var(--text-secondary)] mb-2">Loaded skill: <span className="text-blue-400 font-mono">{skillMeta.name}</span></div>
          <div className="space-y-1">
            {skillMeta.triggers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-green-400 bg-green-950 px-1.5 py-0.5 rounded">
                  {t.pattern}
                </span>
                <span className="text-[var(--text-secondary)]">{t.description}</span>
              </div>
            ))}
            {skillMeta.triggers.length === 0 && (
              <span className="text-xs text-[var(--text-secondary)]">No triggers defined</span>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={triggerInput}
          onChange={(e) => setTriggerInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runTest()}
          placeholder="Type a trigger phrase to test..."
          className="flex-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={runTest}
          disabled={!skillMeta || isRunning || !triggerInput.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-30 hover:bg-blue-700 transition-colors"
        >
          <Play size={14} />
          {isRunning ? "Running..." : "Test"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {result.status === "success" ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-400">Trigger matched!</span>
              </>
            ) : result.status === "no-match" ? (
              <>
                <XCircle size={16} className="text-red-500" />
                <span className="text-red-400">No trigger matched</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-amber-500" />
                <span className="text-amber-400">Error</span>
              </>
            )}
          </div>

          {/* Match details */}
          {result.matchedTrigger && (
            <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3 space-y-2">
              <div className="text-xs text-[var(--text-secondary)]">
                Matched pattern: <span className="font-mono text-blue-400">{result.matchedTrigger}</span>
              </div>
              {result.capturedGroups.length > 0 && (
                <div className="text-xs text-[var(--text-secondary)]">
                  Captured groups:{" "}
                  {result.capturedGroups.map((g, i) => (
                    <span key={i} className="inline-block ml-1 font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">
                      ${i + 1}={g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Output */}
          <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
            <div className="text-xs text-[var(--text-secondary)] mb-2">Simulated Output</div>
            <pre className="text-sm font-mono whitespace-pre-wrap text-[var(--text-primary)]">
              {result.output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
