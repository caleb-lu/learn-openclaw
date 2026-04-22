"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#10B981";
const steps = ["Platform (Telegram)", "Bot Service", "Gateway", "Agent Response"];

const nodes = [
  { x: 40, y: 100, w: 120, h: 50, label: "Telegram", icon: "✈️" },
  { x: 210, y: 100, w: 120, h: 50, label: "Bot Service", icon: "🤖" },
  { x: 380, y: 100, w: 120, h: 50, label: "Gateway", icon: "⚙️" },
  { x: 550, y: 100, w: 120, h: 50, label: "Agent", icon: "🧠" },
];

const forwardArrows = [
  { x1: 160, y1: 125, x2: 210, y2: 125 },
  { x1: 330, y1: 125, x2: 380, y2: 125 },
  { x1: 500, y1: 125, x2: 550, y2: 125 },
];

const returnPath = "M 610 150 L 610 200 L 100 200 L 100 150";

export default function ChannelSetupVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Single Channel Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 720 260" className="w-full max-w-xl mx-auto" style={{ maxHeight: 280 }}>
        {nodes.map((node, i) => (
          <g key={i}>
            <motion.rect
              x={node.x} y={node.y} width={node.w} height={node.h}
              rx={10} fill={currentStep >= i ? `${color}20` : "transparent"}
              stroke={currentStep >= i ? color : "var(--border-color)"}
              strokeWidth={currentStep === i ? 2.5 : 1}
              initial={{ opacity: 0, y: 15 }}
              animate={currentStep >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
            />
            <motion.text
              x={node.x + node.w / 2} y={node.y + node.h / 2 + 5}
              textAnchor="middle" fontSize={13} fill="var(--text-primary)"
              initial={{ opacity: 0 }} animate={currentStep >= i ? { opacity: 1 } : { opacity: 0 }}>
              {node.icon} {node.label}
            </motion.text>
          </g>
        ))}

        {forwardArrows.map((a, i) => (
          <motion.line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke={color} strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={currentStep >= i + 1 ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.4 }} />
        ))}

        {/* Return arrow */}
        <motion.path
          d={returnPath} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="6 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={currentStep >= 3 ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8 }}>
        </motion.path>
        <motion.text x={360} y={218} textAnchor="middle" fontSize={10} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={currentStep >= 3 ? { opacity: 1 } : { opacity: 0 }}>
          response flows back to Telegram
        </motion.text>

        <motion.text x={360} y={250} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {["Message sent on Telegram platform", "Bot receives and forwards to Gateway", "Gateway routes to the agent", "Agent generates and returns response"][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
