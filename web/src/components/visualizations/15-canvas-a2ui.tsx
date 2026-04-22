"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#F59E0B";
const steps = ["Agent Generates", "Canvas Template", "Renderer", "Channel Display"];

const pipelineNodes = [
  { label: "Agent", sub: "Generates UI", icon: "🧠", x: 40, y: 100 },
  { label: "Canvas", sub: "Template", icon: "📐", x: 200, y: 100 },
  { label: "Renderer", sub: "Process", icon: "🎨", x: 360, y: 100 },
  { label: "Display", sub: "On Channel", icon: "📺", x: 480, y: 100 },
];

export default function CanvasA2UIVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Canvas Rendering Pipeline</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 620 300" className="w-full max-w-xl mx-auto" style={{ maxHeight: 320 }}>
        {/* Pipeline frame */}
        <motion.rect x={25} y={70} width={570} height={110} rx={12}
          fill="var(--bg-secondary, #f8f9fa)" stroke="var(--border-color)" strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} />

        {pipelineNodes.map((node, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          return (
            <g key={node.label}>
              {i > 0 && (
                <motion.line x1={node.x - 25} y1={135} x2={node.x - 45} y2={135}
                  stroke={color} strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={show ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }} />
              )}

              <motion.rect x={node.x} y={node.y} width={110} height={60} rx={10}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2.5 : 1}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4 }} />
              <motion.text x={node.x + 55} y={node.y + 24}
                textAnchor="middle" fontSize={16}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.icon}
              </motion.text>
              <motion.text x={node.x + 55} y={node.y + 42}
                textAnchor="middle" fontSize={12} fontWeight="bold"
                fill={active ? color : "var(--text-primary)"}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.label}
              </motion.text>
              <motion.text x={node.x + 55} y={node.y + 55}
                textAnchor="middle" fontSize={9} fill="var(--text-secondary)"
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.sub}
              </motion.text>
            </g>
          );
        })}

        {/* Canvas preview */}
        {currentStep >= 2 && (
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <rect x={150} y={200} width={300} height={55} rx={8} fill="#1e1e2e" stroke="#555" strokeWidth={1} />
            <rect x={165} y={212} width={60} height={8} rx={4} fill={`${color}60`} />
            <rect x={165} y={226} width={120} height={8} rx={4} fill="#444" />
            <rect x={165} y={240} width={90} height={8} rx={4} fill="#444" />
            <rect x={370} y={212} width={60} height={30} rx={6} fill={color} />
            <text x={400} y={232} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">Action</text>
          </motion.g>
        )}

        <motion.text x={310} y={290} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "Agent decides to generate a UI element",
            "Canvas template defines the layout structure",
            "Renderer processes the template into channel format",
            "Final UI is displayed on the target channel"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
