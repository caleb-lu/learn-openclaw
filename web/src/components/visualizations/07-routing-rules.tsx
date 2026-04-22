"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#10B981";
const steps = ["Message Arrives", "Pattern Matching", "Binding Table Lookup", "Agent Selected"];

interface RouteNode {
  label: string; x: number; y: number; w: number; h: number;
}

const nodes: RouteNode[] = [
  { label: "Message In", x: 200, y: 20, w: 140, h: 40 },
  { label: "Pattern Match", x: 180, y: 90, w: 180, h: 40 },
  { label: "Binding Table", x: 170, y: 160, w: 200, h: 40 },
  { label: "Agent A", x: 60, y: 240, w: 110, h: 40 },
  { label: "Agent B", x: 210, y: 240, w: 110, h: 40 },
  { label: "Agent C", x: 360, y: 240, w: 110, h: 40 },
];

const edges = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 3, to: 5 },
  { from: 3, to: 6 },
];

function nodeCenter(n: RouteNode) {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

export default function RoutingRulesVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  const showNode = (idx: number) => {
    if (idx <= 2) return currentStep >= idx;
    return currentStep >= 3;
  };

  const highlightNode = (idx: number) => {
    if (idx <= 2) return currentStep === idx;
    return currentStep === 3;
  };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Routing Decision Tree</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 530 310" className="w-full max-w-lg mx-auto" style={{ maxHeight: 330 }}>
        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodeCenter(nodes[e.from - 1]);
          const to = nodeCenter(nodes[e.to - 1]);
          return (
            <motion.line key={i} x1={from.x} y1={from.y + 20} x2={to.x} y2={to.y - 20}
              stroke={color} strokeWidth={1.5} strokeDasharray={i >= 2 ? "4 3" : "none"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={showNode(e.to - 1) ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }} />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <motion.rect x={node.x} y={node.y} width={node.w} height={node.h} rx={8}
              fill={highlightNode(i) ? `${color}25` : showNode(i) ? `${color}10` : "transparent"}
              stroke={showNode(i) ? color : "var(--border-color)"}
              strokeWidth={highlightNode(i) ? 2.5 : 1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={showNode(i) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35 }} />
            <motion.text x={node.x + node.w / 2} y={node.y + node.h / 2 + 5}
              textAnchor="middle" fontSize={13} fill="var(--text-primary)"
              fontWeight={highlightNode(i) ? "bold" : "normal"}
              initial={{ opacity: 0 }}
              animate={showNode(i) ? { opacity: 1 } : { opacity: 0 }}>
              {node.label}
            </motion.text>
          </g>
        ))}

        {/* Step labels */}
        <motion.text x={265} y={300} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "Incoming message triggers routing pipeline",
            "Regex patterns are matched against the message",
            "Binding table maps patterns to agents",
            "The matched agent is selected for processing"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
