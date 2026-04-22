"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#3B82F6";
const steps = ["SOUL.md", "IDENTITY.md", "TOOLS.md", "MEMORY.md"];

const files = [
  { name: "SOUL.md", desc: "Core personality & values", icon: "🧠", x: 180, y: 50 },
  { name: "IDENTITY.md", desc: "Name, role & tone", icon: "🎭", x: 180, y: 120 },
  { name: "TOOLS.md", desc: "Available capabilities", icon: "🔧", x: 180, y: 190 },
  { name: "MEMORY.md", desc: "Persistent context store", icon: "💾", x: 180, y: 260 },
];

export default function WorkspaceVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Workspace File Hierarchy</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: Adding {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 400 320" className="w-full max-w-md mx-auto" style={{ maxHeight: 340 }}>
        {/* Folder root */}
        <motion.rect x={100} y={10} width={200} height={30} rx={6} fill={`${color}15`} stroke={color} strokeWidth={1.5} />
        <motion.text x={200} y={30} textAnchor="middle" fontSize={13} fontWeight="bold" fill={color}>
          📁 workspace/
        </motion.text>

        {files.map((file, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          return (
            <g key={file.name}>
              <motion.line
                x1={120} y1={30} x2={120} y2={file.y + 12}
                stroke="var(--border-color)" strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={show ? { pathLength: 1 } : { pathLength: 0 }}
              />
              <motion.line
                x1={120} y1={file.y + 12} x2={150} y2={file.y + 12}
                stroke="var(--border-color)" strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={show ? { pathLength: 1 } : { pathLength: 0 }}
              />
              <motion.rect
                x={150} y={file.y - 4} width={200} height={34} rx={6}
                fill={active ? `${color}25` : "transparent"}
                stroke={active ? color : "var(--border-color)"}
                strokeWidth={active ? 2 : 1}
                initial={{ opacity: 0, x: -20 }}
                animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              />
              <motion.text
                x={166} y={file.y + 18} fontSize={14} fill="var(--text-primary)"
                initial={{ opacity: 0 }}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                {file.icon} {file.name}
              </motion.text>
              <motion.text
                x={348} y={file.y + 18} textAnchor="end" fontSize={10} fill="var(--text-secondary)"
                initial={{ opacity: 0 }}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {file.desc}
              </motion.text>
            </g>
          );
        })}
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
