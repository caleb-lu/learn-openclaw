"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#10B981";
const steps = ["Single Channel", "Multiple Channels", "Parallel Execution"];

const channels = [
  { label: "Telegram", x: 60, y: 50, icon: "✈️" },
  { label: "Discord", x: 60, y: 110, icon: "🎮" },
  { label: "Slack", x: 60, y: 170, icon: "💬" },
  { label: "WebChat", x: 60, y: 230, icon: "🌐" },
];

export default function MultiChannelVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(3);

  const visibleChannels = currentStep >= 1 ? channels.length : 1;

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Multi-Channel Parallel Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 520 300" className="w-full max-w-xl mx-auto" style={{ maxHeight: 320 }}>
        {channels.map((ch, i) => (
          <g key={ch.label}>
            <motion.rect x={ch.x} y={ch.y} width={110} height={36} rx={8}
              fill={i < visibleChannels ? `${color}20` : "transparent"}
              stroke={i < visibleChannels ? color : "var(--border-color)"}
              strokeWidth={currentStep === 2 && i < visibleChannels ? 2 : 1}
              initial={{ opacity: 0, x: -20 }}
              animate={i < visibleChannels ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: i * 0.1 }} />
            <motion.text x={ch.x + 55} y={ch.y + 23} textAnchor="middle" fontSize={12} fill="var(--text-primary)"
              initial={{ opacity: 0 }} animate={i < visibleChannels ? { opacity: 1 } : { opacity: 0 }}>
              {ch.icon} {ch.label}
            </motion.text>

            {i < visibleChannels && (
              <motion.line x1={170} y1={ch.y + 18} x2={250} y2={140}
                stroke={color} strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={currentStep >= 1 ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} />
            )}
          </g>
        ))}

        {/* Central Gateway */}
        <motion.rect x={250} y={115} width={120} height={50} rx={10}
          fill={`${color}25`} stroke={color} strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }} />
        <motion.text x={310} y={138} textAnchor="middle" fontSize={14} fontWeight="bold" fill={color}>
          Gateway
        </motion.text>
        <motion.text x={310} y={155} textAnchor="middle" fontSize={10} fill="var(--text-secondary)">
          routes all
        </motion.text>

        {/* Agent box */}
        <motion.rect x={420} y={115} width={80} height={50} rx={10}
          fill={currentStep >= 2 ? `${color}20` : "transparent"}
          stroke={currentStep >= 2 ? color : "var(--border-color)"}
          strokeWidth={currentStep >= 2 ? 2 : 1}
          initial={{ opacity: 0, x: 20 }} animate={currentStep >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }} />
        <motion.text x={460} y={145} textAnchor="middle" fontSize={13} fill="var(--text-primary)"
          initial={{ opacity: 0 }} animate={currentStep >= 2 ? { opacity: 1 } : { opacity: 0 }}>
          Agent
        </motion.text>

        <motion.line x1={370} y1={140} x2={420} y2={140} stroke={color} strokeWidth={2}
          initial={{ pathLength: 0 }} animate={currentStep >= 2 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5 }} />

        {/* Parallel indicator */}
        {currentStep === 2 && (
          <motion.text x={310} y={280} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            All channels processed in parallel by the Gateway
          </motion.text>
        )}
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={3} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
