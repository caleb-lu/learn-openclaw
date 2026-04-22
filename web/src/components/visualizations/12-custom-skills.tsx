"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#8B5CF6";
const steps = ["Create SKILL.md", "Add Frontmatter", "Define Triggers", "Test Skill"];

const workflowNodes = [
  { label: "Create\nSKILL.md", x: 60, y: 80, icon: "📄" },
  { label: "Add\nFrontmatter", x: 220, y: 80, icon: "📝" },
  { label: "Define\nTriggers", x: 380, y: 80, icon: "⚡" },
  { label: "Test\nSkill", x: 380, y: 200, icon: "✅" },
];

const connections = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
];

export default function CustomSkillsVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  function getNodeCenter(idx: number) {
    const n = workflowNodes[idx];
    return { x: n.x + 60, y: n.y + 30 };
  }

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Skill Creation Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 520 300" className="w-full max-w-lg mx-auto" style={{ maxHeight: 320 }}>
        {/* Connections */}
        {connections.map((conn, i) => {
          const from = getNodeCenter(conn.from);
          const to = getNodeCenter(conn.to);
          const isVertical = conn.from === 2;
          return (
            <motion.line key={i}
              x1={from.x} y1={from.y} x2={isVertical ? to.x : to.x - 50} y2={isVertical ? to.y - 20 : to.y}
              stroke={color} strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={currentStep > i ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5 }} />
          );
        })}

        {/* Nodes */}
        {workflowNodes.map((node, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          const lines = node.label.split("\n");
          return (
            <g key={node.label}>
              <motion.rect x={node.x} y={node.y} width={120} height={60} rx={10}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2.5 : 1}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4 }} />
              <motion.text x={node.x + 60} y={node.y + 22} textAnchor="middle" fontSize={16}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {node.icon}
              </motion.text>
              {lines.map((line, li) => (
                <motion.text key={li} x={node.x + 60} y={node.y + 38 + li * 14}
                  textAnchor="middle" fontSize={12}
                  fontWeight={active ? "bold" : "normal"}
                  fill={active ? color : "var(--text-primary)"}
                  initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                  {line}
                </motion.text>
              ))}
            </g>
          );
        })}

        {/* Code snippet for active step */}
        {currentStep === 1 && (
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <rect x={60} y={195} width={280} height={70} rx={6} fill="#1e1e2e" stroke="#444" />
            <text x={75} y={215} fontSize={10} fill="#7c3aed">---</text>
            <text x={75} y={230} fontSize={10} fill="#a78bfa">name: my-skill</text>
            <text x={75} y={245} fontSize={10} fill="#a78bfa">version: 1.0.0</text>
            <text x={75} y={260} fontSize={10} fill="#7c3aed">---</text>
          </motion.g>
        )}

        <motion.text x={260} y={295} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "Create a new SKILL.md file in the skills directory",
            "Add YAML frontmatter with name, version, and description",
            "Define trigger patterns and execution logic",
            "Test the skill with sample inputs"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
