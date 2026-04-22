"use client";

import { useState, useMemo } from "react";
import { A2UIRenderer } from "./a2ui-renderer";

const SAMPLE_CANVAS_JSON = JSON.stringify(
  {
    type: "container",
    props: { padding: 0 },
    children: [
      {
        type: "heading",
        content: "Daily Task Summary",
        props: { size: "lg" },
      },
      {
        type: "text",
        content: "Here is your task overview for today.",
      },
      {
        type: "card",
        content: "In Progress",
        children: [
          {
            type: "list",
            children: [
              { type: "text", content: "Review pull request #42" },
              { type: "text", content: "Update API documentation" },
              { type: "text", content: "Fix login page styling" },
            ],
          },
        ],
      },
      {
        type: "card",
        content: "Completed",
        children: [
          {
            type: "list",
            children: [
              { type: "text", content: "Set up CI/CD pipeline" },
              { type: "text", content: "Database migration script" },
            ],
          },
        ],
      },
      {
        type: "container",
        props: { padding: 8 },
        children: [
          {
            type: "button",
            content: "View Full Report",
            props: { variant: "primary" },
          },
          {
            type: "button",
            content: "Dismiss",
            props: { variant: "default" },
          },
        ],
      },
    ],
  },
  null,
  2
);

export function CanvasPreview() {
  const [view, setView] = useState<"preview" | "json">("preview");
  const [jsonInput, setJsonInput] = useState(SAMPLE_CANVAS_JSON);

  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(jsonInput), null, 2);
    } catch {
      return jsonInput;
    }
  }, [jsonInput]);

  const isValidJson = useMemo(() => {
    try {
      JSON.parse(jsonInput);
      return true;
    } catch {
      return false;
    }
  }, [jsonInput]);

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Canvas Preview</h3>
        <div className="flex rounded-md border border-[var(--border-color)] overflow-hidden">
          <button
            onClick={() => setView("preview")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "preview"
                ? "bg-blue-600 text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("json")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "json"
                ? "bg-blue-600 text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {/* JSON Input (visible in JSON view) */}
      {view === "json" && (
        <div className="relative">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[400px] rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {!isValidJson && (
            <div className="absolute top-3 right-3 text-xs text-red-400 bg-red-950 px-2 py-1 rounded">
              Invalid JSON
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {view === "preview" && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            A2UI Rendered Output
          </div>
          <A2UIRenderer json={jsonInput} />
        </div>
      )}

      {/* Pipeline indicator */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span className="font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">
          Canvas JSON
        </span>
        <span className="text-[var(--text-secondary)]">&rarr;</span>
        <span className="font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">
          A2UI Parse
        </span>
        <span className="text-[var(--text-secondary)]">&rarr;</span>
        <span className="font-mono bg-[var(--bg-secondary)] px-2 py-1 rounded">
          React Components
        </span>
      </div>
    </div>
  );
}
