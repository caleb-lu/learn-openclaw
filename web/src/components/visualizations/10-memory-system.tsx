"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#8B5CF6";
const steps = ["Conversation", "Memory Write", "Memory Store", "Memory Recall"];

const cx = 260, cy = 150, r = 100;

const stageNodes = [
  { label: "Conversation", angle: -90, icon: "💬" },
  { label: "Write", angle: 0, icon: "✏️" },
  { label: "Store", angle: 90, icon: "💾" },
  { label: "Recall", angle: 180, icon: "🔄" },
];

function polarToCart(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export default function MemorySystemVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Memory Read/Write Cycle</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 520 320" className="w-full max-w-lg mx-auto" style={{ maxHeight: 340 }}>
        {/* Center label */}
        <motion.circle cx={cx} cy={cy} r={38} fill={`${color}15`} stroke={color} strokeWidth={1.5}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
        <motion.text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill={color}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          MEMORY
        </motion.text>
        <motion.text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          SYSTEM
        </motion.text>

        {/* Circular arrows */}
        {stageNodes.map((stage, i) => {
          const pos = polarToCart(stage.angle, r);
          const nextStage = stageNodes[(i + 1) % stageNodes.length];
          const nextPos = polarToCart(nextStage.angle, r);

          return (
            <motion.line key={i}
              x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y}
              stroke={color} strokeWidth={1.5} strokeDasharray="5 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={currentStep >= i ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          );
        })}

        {/* Stage nodes */}
        {stageNodes.map((stage, i) => {
          const pos = polarToCart(stage.angle, r);
          const isActive = currentStep === i;
          return (
            <g key={stage.label}>
              <motion.rect
                x={pos.x - 50} y={pos.y - 16} width={100} height={32} rx={8}
                fill={isActive ? `${color}25` : currentStep > i ? `${color}10` : "transparent"}
                stroke={color}
                strokeWidth={isActive ? 2.5 : currentStep > i ? 1 : 0.5}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={currentStep >= i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.4 }}
              />
              <motion.text x={pos.x} y={pos.y + 5}
                textAnchor="middle" fontSize={12}
                fontWeight={isActive ? "bold" : "normal"}
                fill={isActive ? color : "var(--text-primary)"}
                initial={{ opacity: 0 }}
                animate={currentStep >= i ? { opacity: 1 } : { opacity: 0 }}>
                {stage.icon} {stage.label}
              </motion.text>
            </g>
          );
        })}

        {/* Step description */}
        <motion.text x={260} y={305} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "User conversation generates new context",
            "Key facts are extracted and written to memory",
            "Facts are persisted in the memory store",
            "Relevant memories are recalled for future conversations"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
