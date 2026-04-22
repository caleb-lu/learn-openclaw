"use client";
import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "@/components/visualizations/shared/step-controls";

const LAYERS = [
  { name: "System Base", source: "Model defaults", desc: "Base instructions from the AI model", color: "#94a3b8" },
  { name: "openclaw.json", source: "config", desc: "systemPrompt from configuration", color: "#3B82F6" },
  { name: "SOUL.md", source: "workspace", desc: "Core personality and identity", color: "#8B5CF6" },
  { name: "IDENTITY.md", source: "workspace", desc: "Name, tone, expertise", color: "#A855F7" },
  { name: "TOOLS.md", source: "workspace", desc: "Available tools and permissions", color: "#10B981" },
  { name: "MEMORY.md", source: "workspace", desc: "Context from memory recall", color: "#F59E0B" },
  { name: "SKILL.md", source: "active skills", desc: "Instructions from active skills", color: "#EF4444" },
  { name: "User Message", source: "conversation", desc: "Current message + history", color: "#06B6D4" },
];

export function PromptStack() {
  const viz = useSteppedVisualization(LAYERS.length);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {LAYERS.slice(0, viz.currentStep + 1).map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border p-3"
            style={{ borderColor: `${layer.color}44`, backgroundColor: `${layer.color}11` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono" style={{ color: layer.color }}>L{i + 1}</span>
                <span className="text-sm font-medium ml-2">{layer.name}</span>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">{layer.source}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{layer.desc}</p>
          </motion.div>
        ))}
      </div>
      <StepControls {...viz} onPrev={viz.prev} onNext={viz.next} onReset={viz.reset} />
    </div>
  );
}
