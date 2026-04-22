"use client";

import { useState } from "react";
import { SoulEditor } from "./editor";
import { SoulPreview } from "./preview";

export function SoulWorkshop() {
  const [soulContent, setSoulContent] = useState("");
  const [identityContent] = useState("name: \"MyAssistant\"\ntone: friendly\nexpertise: general");
  const [toolsContent] = useState("- web_search\n- calculator\n- file_operations");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-semibold mb-3">Edit</h3>
          <SoulEditor />
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">IDENTITY.md</label>
            <textarea
              value={identityContent}
              readOnly
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--code-bg)] p-3 text-xs font-mono h-20"
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block">TOOLS.md</label>
            <textarea
              value={toolsContent}
              readOnly
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--code-bg)] p-3 text-xs font-mono h-20"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Preview</h3>
          <SoulPreview soulContent={soulContent || "# Core Identity\n\nYou are a warm, friendly AI assistant."} identityContent={identityContent} toolsContent={toolsContent} />
        </div>
      </div>
    </div>
  );
}
