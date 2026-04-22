"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#8B5CF6";
const steps = [
  "System Prompt",
  "openclaw.json",
  "SOUL.md",
  "IDENTITY.md",
  "TOOLS.md",
  "MEMORY.md",
  "SKILL.md",
  "User Message",
];

const layers = [
  { label: "System", color: "#EF4444" },
  { label: "openclaw.json", color: "#F59E0B" },
  { label: "SOUL", color: "#10B981" },
  { label: "IDENTITY", color: "#3B82F6" },
  { label: "TOOLS", color: "#8B5CF6" },
  { label: "MEMORY", color: "#EC4899" },
  { label: "SKILL", color: "#14B8A6" },
  { label: "User", color: "#F97316" },
];

export default function PromptEngineeringVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(8);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Layer Stack Animation</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Layer {currentStep + 1}/8: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 400 360" className="w-full max-w-md mx-auto" style={{ maxHeight: 380 }}>
        {layers.map((layer, i) => {
          const isActive = currentStep === i;
          const isPast = currentStep > i;
          const cardWidth = 200 - i * 8;
          const cardX = (400 - cardWidth) / 2;
          const cardY = 20 + i * 38;

          return (
            <g key={layer.label}>
              <motion.rect
                x={cardX} y={cardY} width={cardWidth} height={34} rx={6}
                fill={isActive ? `${layer.color}30` : isPast ? `${layer.color}15` : "transparent"}
                stroke={layer.color}
                strokeWidth={isActive ? 2.5 : isPast ? 1.5 : 0.5}
                opacity={isActive || isPast ? 1 : 0.2}
                initial={{ opacity: 0, y: 40 }}
                animate={isActive || isPast ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 0 }}
                transition={{ duration: 0.4, delay: isActive ? 0 : 0 }}
              />
              <motion.text
                x={400 / 2} y={cardY + 22}
                textAnchor="middle" fontSize={13}
                fontWeight={isActive ? "bold" : "normal"}
                fill={isActive || isPast ? layer.color : "var(--text-secondary)"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {layer.label}
              </motion.text>
              {isActive && (
                <motion.text
                  x={cardX + cardWidth + 12} y={cardY + 22}
                  fontSize={10} fill="var(--text-secondary)"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  ← {["Base instructions", "Config overrides", "Personality core", "Name & tone", "Capabilities", "Context store", "Triggered skills", "User input"][i]}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Final arrow */}
        {currentStep === 7 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <line x1={200} y1={340} x2={200} y2={355} stroke={color} strokeWidth={2} />
            <text x={200} y={370} textAnchor="middle" fontSize={11} fill={color} fontWeight="bold">
              Combined Prompt → LLM
            </text>
          </motion.g>
        )}
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={8} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
