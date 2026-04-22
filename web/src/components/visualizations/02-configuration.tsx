"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#3B82F6";
const steps = ["Top-Level Keys", "Model Section", "Channels Section", "Automation Section"];

interface TreeNode {
  key: string; x: number; y: number; depth: number;
}

const tree: TreeNode[] = [
  { key: "openclaw.json", x: 240, y: 30, depth: 0 },
  { key: "models", x: 120, y: 80, depth: 1 },
  { key: "channels", x: 240, y: 80, depth: 1 },
  { key: "automation", x: 370, y: 80, depth: 1 },
  { key: "provider", x: 60, y: 130, depth: 2 },
  { key: "model_id", x: 180, y: 130, depth: 2 },
  { key: "telegram", x: 240, y: 130, depth: 2 },
  { key: "discord", x: 240, y: 170, depth: 2 },
  { key: "cron", x: 340, y: 130, depth: 2 },
  { key: "webhooks", x: 340, y: 170, depth: 2 },
  { key: "temp", x: 60, y: 170, depth: 2 },
  { key: "max_tokens", x: 180, y: 170, depth: 2 },
];

function visibleSet(step: number): Set<string> {
  const sets: Set<string>[] = [
    new Set(["openclaw.json", "models", "channels", "automation"]),
    new Set(["openclaw.json", "models", "channels", "automation", "provider", "model_id", "temp", "max_tokens"]),
    new Set(["openclaw.json", "models", "channels", "automation", "telegram", "discord"]),
    new Set(["openclaw.json", "models", "channels", "automation", "cron", "webhooks"]),
  ];
  return sets[step];
}

export default function ConfigurationVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);
  const visible = visibleSet(currentStep);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Configuration File Structure</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 480 210" className="w-full max-w-lg mx-auto" style={{ maxHeight: 240 }}>
        {tree.map((node, i) => {
          const show = visible.has(node.key);
          const isHighlight = (currentStep === 0 && node.depth === 0) ||
            (currentStep === 1 && node.key === "models") ||
            (currentStep === 1 && node.depth === 2 && ["provider", "model_id", "temp", "max_tokens"].includes(node.key)) ||
            (currentStep === 2 && ["channels", "telegram", "discord"].includes(node.key)) ||
            (currentStep === 3 && ["automation", "cron", "webhooks"].includes(node.key));

          return (
            <g key={node.key}>
              <motion.rect
                x={node.x - node.key.length * 3.5 - 8} y={node.y - 10}
                width={node.key.length * 7 + 16} height={24} rx={4}
                fill={isHighlight ? `${color}30` : "transparent"}
                stroke={isHighlight ? color : "var(--border-color)"}
                strokeWidth={isHighlight ? 1.5 : 0.5}
                initial={{ opacity: 0, x: -10 }}
                animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              />
              <motion.text
                x={node.x} y={node.y + 5}
                textAnchor="middle" fontSize={node.depth === 0 ? 14 : 12}
                fill={node.depth === 0 ? color : "var(--text-primary)"}
                fontWeight={node.depth === 0 ? "bold" : "normal"}
                initial={{ opacity: 0 }}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                {node.key}
              </motion.text>
            </g>
          );
        })}
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
