"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-[var(--code-bg)] rounded-lg">
      <Loader2 size={24} className="animate-spin text-[var(--text-secondary)]" />
    </div>
  ),
});

export function JsonEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  height = "300px",
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-[var(--border-color)] overflow-hidden ${className ?? ""}`}>
      <MonacoEditor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
        }}
      />
    </div>
  );
}
