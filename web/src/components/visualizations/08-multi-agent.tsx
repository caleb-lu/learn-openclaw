"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#10B981";
const steps = ["Incoming Message", "Router Decision", "Agent Selection", "Response"];

const agents = [
  { label: "Agent A\n(Coder)", x: 50, y: 190, color: "#3B82F6" },
  { label: "Agent B\n(Writer)", x: 210, y: 190, color: "#10B981" },
  { label: "Agent C\n(Analyst)", x: 370, y: 190, color: "#8B5CF6" },
];

export default function MultiAgentVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  const activeAgent = currentStep === 2 ? 0 : currentStep === 3 ? 0 : -1;

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Agent Switching Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 520 310" className="w-full max-w-xl mx-auto" style={{ maxHeight: 330 }}>
        {/* Incoming message */}
        <motion.rect x={190} y={20} width={140} height={40} rx={10}
          fill={currentStep >= 0 ? `${color}20` : "transparent"}
          stroke={currentStep >= 0 ? color : "var(--border-color)"}
          strokeWidth={currentStep === 0 ? 2.5 : 1}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: currentStep >= 0 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.4 }} />
        <motion.text x={260} y={45} textAnchor="middle" fontSize={13} fill="var(--text-primary)"
          initial={{ opacity: 0 }} animate={currentStep >= 0 ? { opacity: 1 } : { opacity: 0 }}>
          Incoming Msg
        </motion.text>

        {/* Arrow to Router */}
        <motion.line x1={260} y1={60} x2={260} y2={90} stroke={color} strokeWidth={2}
          initial={{ pathLength: 0 }} animate={currentStep >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4 }} />

        {/* Router */}
        <motion.rect x={200} y={90} width={120} height={44} rx={10}
          fill={currentStep >= 1 ? `${color}25` : "transparent"}
          stroke={currentStep >= 1 ? color : "var(--border-color)"}
          strokeWidth={currentStep === 1 ? 2.5 : 1}
          initial={{ opacity: 0 }} animate={currentStep >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }} />
        <motion.text x={260} y={117} textAnchor="middle" fontSize={13} fontWeight="bold" fill={color}
          initial={{ opacity: 0 }} animate={currentStep >= 1 ? { opacity: 1 } : { opacity: 0 }}>
          Router
        </motion.text>

        {/* Arrows to agents */}
        {agents.map((ag, i) => (
          <motion.line key={i}
            x1={260} y1={134} x2={ag.x + 60} y2={ag.y}
            stroke={ag.color} strokeWidth={currentStep === 2 && i === 0 ? 2.5 : 1.5}
            strokeDasharray={currentStep < 2 ? "4 3" : "none"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={currentStep >= 2 ? { pathLength: 1, opacity: i === 0 ? 1 : 0.3 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }} />
        ))}

        {/* Agent boxes */}
        {agents.map((ag, i) => (
          <g key={ag.label}>
            <motion.rect x={ag.x} y={ag.y} width={120} height={50} rx={10}
              fill={currentStep >= 2 && i === 0 ? `${ag.color}25` : "transparent"}
              stroke={currentStep >= 2 ? ag.color : "var(--border-color)"}
              strokeWidth={currentStep >= 2 && i === 0 ? 2.5 : 1}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={currentStep >= 2 ? { opacity: i === 0 ? 1 : 0.5, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, delay: i * 0.1 }} />
            <motion.text x={ag.x + 60} y={ag.y + 22} textAnchor="middle" fontSize={12}
              fill={i === 0 && currentStep >= 2 ? ag.color : "var(--text-primary)"}
              fontWeight={i === 0 && currentStep >= 2 ? "bold" : "normal"}
              initial={{ opacity: 0 }}
              animate={currentStep >= 2 ? { opacity: i === 0 ? 1 : 0.5 } : { opacity: 0 }}>
              {ag.label.split("\n")[0]}
            </motion.text>
            <motion.text x={ag.x + 60} y={ag.y + 38} textAnchor="middle" fontSize={10}
              fill="var(--text-secondary)"
              initial={{ opacity: 0 }}
              animate={currentStep >= 2 ? { opacity: i === 0 ? 1 : 0.5 } : { opacity: 0 }}>
              {ag.label.split("\n")[1]}
            </motion.text>
          </g>
        ))}

        {/* Response arrow */}
        {currentStep >= 3 && (
          <motion.line x1={110} y1={240} x2={110} y2={280} stroke={agents[0].color} strokeWidth={2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
        )}
        {currentStep >= 3 && (
          <motion.rect x={60} y={275} width={100} height={28} rx={8}
            fill={`${agents[0].color}20`} stroke={agents[0].color} strokeWidth={1.5}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
        )}
        {currentStep >= 3 && (
          <motion.text x={110} y={294} textAnchor="middle" fontSize={11} fill="var(--text-primary)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Response
          </motion.text>
        )}

        <motion.text x={260} y={305} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {["A message arrives at the Gateway", "Router analyzes content and context", "Router selects the best agent for the task", "Selected agent generates the response"][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
