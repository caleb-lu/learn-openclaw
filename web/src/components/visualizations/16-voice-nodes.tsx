"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#F59E0B";
const steps = ["Central Gateway", "Phone Node", "Desktop Node", "Speaker Node"];

const centerNode = { x: 260, y: 140 };
const deviceNodes = [
  { label: "Phone", icon: "📱", angle: -120, dist: 130 },
  { label: "Desktop", icon: "🖥️", angle: -30, dist: 130 },
  { label: "Speaker", icon: "🔊", angle: 60, dist: 130 },
];

function polarXY(angle: number, dist: number, cx: number, cy: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + dist * Math.cos(rad), y: cy + dist * Math.sin(rad) };
}

export default function VoiceNodesVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Device Node Topology</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 520 320" className="w-full max-w-lg mx-auto" style={{ maxHeight: 340 }}>
        {/* Connection lines */}
        {deviceNodes.map((dev, i) => {
          const pos = polarXY(dev.angle, dev.dist, centerNode.x, centerNode.y);
          const show = currentStep >= i + 1;
          return (
            <motion.line key={dev.label}
              x1={centerNode.x} y1={centerNode.y} x2={pos.x} y2={pos.y}
              stroke={color} strokeWidth={show ? 2 : 1}
              strokeDasharray={show ? "none" : "4 3"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={show ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5 }} />
          );
        })}

        {/* Central Gateway */}
        <motion.circle cx={centerNode.x} cy={centerNode.y} r={40}
          fill={`${color}20`} stroke={color} strokeWidth={2}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
        <motion.text x={centerNode.x} y={centerNode.y - 4}
          textAnchor="middle" fontSize={11} fontWeight="bold" fill={color}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Gateway
        </motion.text>
        <motion.text x={centerNode.x} y={centerNode.y + 12}
          textAnchor="middle" fontSize={9} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Central Hub
        </motion.text>

        {/* Device nodes */}
        {deviceNodes.map((dev, i) => {
          const pos = polarXY(dev.angle, dev.dist, centerNode.x, centerNode.y);
          const show = currentStep >= i + 1;
          const active = currentStep === i + 1;
          return (
            <g key={dev.label}>
              <motion.circle cx={pos.x} cy={pos.y} r={30}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2.5 : 1}
                initial={{ scale: 0 }} animate={show ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }} />
              <motion.text x={pos.x} y={pos.y - 2}
                textAnchor="middle" fontSize={16}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {dev.icon}
              </motion.text>
              <motion.text x={pos.x} y={pos.y + 16}
                textAnchor="middle" fontSize={10}
                fontWeight={active ? "bold" : "normal"}
                fill={active ? color : "var(--text-primary)"}
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                {dev.label}
              </motion.text>
            </g>
          );
        })}

        <motion.text x={260} y={305} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "The Gateway acts as the central hub for all device nodes",
            "Phone connects for mobile voice interactions",
            "Desktop node enables computer-based voice",
            "Speaker node provides output-only audio playback"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
