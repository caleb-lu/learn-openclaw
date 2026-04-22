"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#3B82F6";
const steps = [
  "Docker Container",
  "Gateway Daemon",
  "CLI Interface",
  "WebChat Client",
];

export default function InstallationVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  const nodes = [
    { x: 200, y: 40, w: 160, h: 48, label: "Docker Container", icon: "🐳" },
    { x: 200, y: 140, w: 160, h: 48, label: "Gateway Daemon", icon: "⚙" },
    { x: 80, y: 260, w: 140, h: 48, label: "CLI", icon: ">" },
    { x: 340, y: 260, w: 140, h: 48, label: "WebChat", icon: "💬" },
  ];

  const arrows = [
    { x1: 280, y1: 88, x2: 280, y2: 140 },
    { x1: 240, y1: 188, x2: 150, y2: 260 },
    { x1: 320, y1: 188, x2: 410, y2: 260 },
  ];

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Gateway Architecture</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 560 340" className="w-full max-w-lg mx-auto" style={{ maxHeight: 320 }}>
        {nodes.map((node, i) => (
          <g key={i}>
            {i > 0 && arrows[i - 1] && (
              <motion.line
                x1={arrows[i - 1].x1} y1={arrows[i - 1].y1}
                x2={arrows[i - 1].x2} y2={arrows[i - 1].y2}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={currentStep >= i ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
            <motion.rect
              x={node.x} y={node.y} width={node.w} height={node.h}
              rx={8} fill={`${color}18`} stroke={color} strokeWidth={2}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={currentStep >= i ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.text
              x={node.x + node.w / 2} y={node.y + node.h / 2 + 5}
              textAnchor="middle" fontSize={14} fill="var(--text-primary)"
              initial={{ opacity: 0 }}
              animate={currentStep >= i ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {node.icon} {node.label}
            </motion.text>
          </g>
        ))}
        {currentStep === 0 && (
          <motion.text x={280} y={320} textAnchor="middle" fontSize={12} fill="var(--text-secondary)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Docker packages the entire runtime environment
          </motion.text>
        )}
        {currentStep === 1 && (
          <motion.text x={280} y={320} textAnchor="middle" fontSize={12} fill="var(--text-secondary)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            The daemon runs inside the container managing all connections
          </motion.text>
        )}
        {currentStep === 2 && (
          <motion.text x={150} y={320} textAnchor="middle" fontSize={12} fill="var(--text-secondary)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            CLI for terminal interactions
          </motion.text>
        )}
        {currentStep === 3 && (
          <motion.text x={410} y={320} textAnchor="middle" fontSize={12} fill="var(--text-secondary)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            WebChat for browser-based chat
          </motion.text>
        )}
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
