"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#F59E0B";
const steps = [
  "All Channels",
  "Router",
  "Multi-Agent",
  "Skills & Memory",
  "Automation",
  "Full System",
];

const systemNodes = [
  // Channels row
  { label: "Telegram", x: 30, y: 30, w: 80, h: 32, color: "#3B82F6", row: 0 },
  { label: "Discord", x: 120, y: 30, w: 80, h: 32, color: "#3B82F6", row: 0 },
  { label: "Slack", x: 210, y: 30, w: 80, h: 32, color: "#3B82F6", row: 0 },
  { label: "WebChat", x: 300, y: 30, w: 80, h: 32, color: "#3B82F6", row: 0 },
  // Router
  { label: "Router", x: 130, y: 90, w: 180, h: 36, color: "#10B981", row: 1 },
  // Agents
  { label: "Agent A", x: 40, y: 150, w: 90, h: 32, color: "#8B5CF6", row: 2 },
  { label: "Agent B", x: 155, y: 150, w: 90, h: 32, color: "#8B5CF6", row: 2 },
  { label: "Agent C", x: 270, y: 150, w: 90, h: 32, color: "#8B5CF6", row: 2 },
  // Skills & Memory
  { label: "Skills", x: 50, y: 210, w: 100, h: 32, color: "#EC4899", row: 3 },
  { label: "Memory", x: 220, y: 210, w: 100, h: 32, color: "#EC4899", row: 3 },
  // Automation
  { label: "Cron", x: 40, y: 260, w: 80, h: 28, color: "#F59E0B", row: 4 },
  { label: "Webhooks", x: 140, y: 260, w: 90, h: 28, color: "#F59E0B", row: 4 },
  { label: "Canvas", x: 250, y: 260, w: 80, h: 28, color: "#F59E0B", row: 4 },
];

const rowVisibility: Record<number, number> = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
};

export default function CapstoneVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(6);

  function isRowVisible(row: number) {
    if (currentStep === 5) return true;
    const minStep = rowVisibility[row] ?? 5;
    return currentStep >= minStep;
  }

  function isRowActive(row: number) {
    if (currentStep === 5) return row === 1;
    return currentStep === row;
  }

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Complete System Architecture</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}/6: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 420 310" className="w-full max-w-lg mx-auto" style={{ maxHeight: 330 }}>
        {systemNodes.map((node, i) => {
          const visible = isRowVisible(node.row);
          const active = isRowActive(node.row);
          return (
            <g key={node.label}>
              <motion.rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6}
                fill={active ? `${node.color}25` : visible ? `${node.color}12` : "transparent"}
                stroke={node.color} strokeWidth={active ? 2.5 : visible ? 1 : 0.5}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35 }} />
              <motion.text x={node.x + node.w / 2} y={node.y + node.h / 2 + 4}
                textAnchor="middle" fontSize={node.row === 1 ? 13 : 11}
                fontWeight={active ? "bold" : "normal"}
                fill={visible ? node.color : "var(--text-secondary)"}
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : { opacity: 0 }}>
                {node.label}
              </motion.text>
            </g>
          );
        })}

        {/* Connecting lines between rows */}
        {[[0, 1], [1, 2], [2, 3], [3, 4]].map(([fromRow, toRow], i) => {
          const fromY = fromRow === 0 ? 62 : fromRow === 1 ? 126 : fromRow === 2 ? 182 : 242;
          const toY = toRow === 1 ? 90 : toRow === 2 ? 150 : toRow === 3 ? 210 : 260;
          const bothVisible = isRowVisible(fromRow) && isRowVisible(toRow);
          return (
            <motion.line key={i}
              x1={210} y1={fromY} x2={210} y2={toY}
              stroke="var(--border-color)" strokeWidth={1.5} strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={bothVisible ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5 }} />
          );
        })}

        {/* Full system highlight border */}
        {currentStep === 5 && (
          <motion.rect x={20} y={18} width={380} height={280} rx={12}
            fill="none" stroke={color} strokeWidth={2}
            strokeDasharray="8 4"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }} />
        )}

        <motion.text x={210} y={305} textAnchor="middle" fontSize={10} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "All channels connect to the Gateway",
            "Router directs messages based on rules",
            "Multiple agents handle specialized tasks",
            "Skills and Memory provide capabilities",
            "Automation runs tasks on schedule or trigger",
            "The complete OpenClaw system in action"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={6} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
