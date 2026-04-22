"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#3B82F6";
const steps = ["User Input", "Gateway Processing", "Model Inference", "Response"];

const nodes = [
  { x: 80, y: 120, w: 120, h: 56, label: "User", sub: '"Hello!"', align: "left" },
  { x: 250, y: 120, w: 140, h: 56, label: "Gateway", sub: "process()", align: "center" },
  { x: 430, y: 120, w: 130, h: 56, label: "LLM Model", sub: "infer()", align: "center" },
  { x: 250, y: 250, w: 140, h: 56, label: "Response", sub: '"Hi there!"', align: "center" },
];

const arrows = [
  { from: [200, 148], to: [250, 148], step: 1 },
  { from: [390, 148], to: [430, 148], step: 2 },
  { from: [495, 176], to: [390, 250], step: 3 },
];

export default function FirstConversationVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Conversation Creation Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 620 340" className="w-full max-w-xl mx-auto" style={{ maxHeight: 360 }}>
        {/* User message bubble */}
        <motion.rect x={30} y={50} width={100} height={30} rx={12} fill={`${color}20`} stroke={color} strokeWidth={1}
          initial={{ opacity: 0, y: -10 }} animate={currentStep >= 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.4 }} />
        <motion.text x={80} y={70} textAnchor="middle" fontSize={12} fill={color}
          initial={{ opacity: 0 }} animate={currentStep >= 0 ? { opacity: 1 } : { opacity: 0 }}>
          "Hello!"
        </motion.text>

        {nodes.map((node, i) => (
          <g key={i}>
            <motion.rect
              x={node.x} y={node.y} width={node.w} height={node.h}
              rx={10} fill={currentStep >= i && currentStep < 4 ? `${color}20` : "transparent"}
              stroke={currentStep >= i && currentStep < 4 ? color : "var(--border-color)"}
              strokeWidth={currentStep === i ? 2.5 : 1}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={currentStep >= i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.text
              x={node.x + node.w / 2} y={node.y + node.h / 2 - 4}
              textAnchor="middle" fontSize={13} fontWeight="bold" fill="var(--text-primary)"
              initial={{ opacity: 0 }} animate={currentStep >= i ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.15 }}>
              {node.label}
            </motion.text>
            <motion.text
              x={node.x + node.w / 2} y={node.y + node.h / 2 + 14}
              textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
              initial={{ opacity: 0 }} animate={currentStep >= i ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}>
              {node.sub}
            </motion.text>
          </g>
        ))}

        {arrows.map((a, i) => (
          <motion.line
            key={i} x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]}
            stroke={color} strokeWidth={2} markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={currentStep >= a.step ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5 }} />
        ))}

        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={color} />
          </marker>
        </defs>

        {/* Step description */}
        <motion.text x={310} y={330} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {["User sends a message", "Gateway processes input", "Model generates inference", "Response returned to user"][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
