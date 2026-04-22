"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#8B5CF6";
const steps = ["ClawHub", "Download", "Parse SKILL.md", "Register"];

const pipelineNodes = [
  { label: "ClawHub", sub: "Registry", x: 40, y: 100, w: 110, h: 50 },
  { label: "Download", sub: "Fetch files", x: 190, y: 100, w: 110, h: 50 },
  { label: "Parse", sub: "SKILL.md", x: 340, y: 100, w: 110, h: 50 },
  { label: "Register", sub: "Activate", x: 490, y: 100, w: 110, h: 50 },
];

export default function SkillInstallationVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Skill Loading Pipeline</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 660 250" className="w-full max-w-xl mx-auto" style={{ maxHeight: 270 }}>
        {/* Pipeline background */}
        <motion.rect x={30} y={75} width={600} height={100} rx={12}
          fill="var(--bg-secondary, #f8f9fa)" stroke="var(--border-color)" strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />

        <motion.text x={330} y={65} textAnchor="middle" fontSize={11} fill="var(--text-secondary)">
          Skill Loading Pipeline
        </motion.text>

        {pipelineNodes.map((node, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          return (
            <g key={node.label}>
              {/* Connector arrow */}
              {i > 0 && (
                <motion.line x1={node.x - 10} y1={125} x2={node.x - 30} y2={125}
                  stroke={color} strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={show ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }} />
              )}

              <motion.rect x={node.x} y={node.y} width={node.w} height={node.h} rx={10}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2.5 : 1}
                initial={{ opacity: 0, y: 20 }}
                animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }} />
              <motion.text x={node.x + node.w / 2} y={node.y + node.h / 2 - 4}
                textAnchor="middle" fontSize={14} fontWeight="bold"
                fill={active ? color : "var(--text-primary)"}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.label}
              </motion.text>
              <motion.text x={node.x + node.w / 2} y={node.y + node.h / 2 + 14}
                textAnchor="middle" fontSize={10} fill="var(--text-secondary)"
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.sub}
              </motion.text>
            </g>
          );
        })}

        {/* Progress bar */}
        <motion.rect x={30} y={195} width={600} height={6} rx={3} fill="var(--border-color)" />
        <motion.rect x={30} y={195} width={600 * ((currentStep + 1) / 4)} height={6} rx={3} fill={color}
          initial={{ width: 0 }} animate={{ width: 600 * ((currentStep + 1) / 4) }}
          transition={{ duration: 0.5 }} />

        <motion.text x={330} y={230} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "Browse available skills on ClawHub registry",
            "Download skill files to the workspace",
            "Parse SKILL.md for metadata and triggers",
            "Register skill with the gateway for activation"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
