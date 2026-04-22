"use client";

interface SoulPreviewProps {
  soulContent: string;
  identityContent?: string;
  toolsContent?: string;
}

export function SoulPreview({ soulContent, identityContent, toolsContent }: SoulPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-900/10 p-4">
        <h4 className="font-semibold text-sm mb-2 text-purple-700 dark:text-purple-400">SOUL.md Preview</h4>
        <pre className="text-xs whitespace-pre-wrap text-[var(--text-secondary)] max-h-40 overflow-y-auto">{soulContent}</pre>
      </div>
      {identityContent && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 p-4">
          <h4 className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-400">IDENTITY.md Preview</h4>
          <pre className="text-xs whitespace-pre-wrap text-[var(--text-secondary)] max-h-40 overflow-y-auto">{identityContent}</pre>
        </div>
      )}
      {toolsContent && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 p-4">
          <h4 className="font-semibold text-sm mb-2 text-emerald-700 dark:text-emerald-400">TOOLS.md Preview</h4>
          <pre className="text-xs whitespace-pre-wrap text-[var(--text-secondary)] max-h-40 overflow-y-auto">{toolsContent}</pre>
        </div>
      )}
    </div>
  );
}
