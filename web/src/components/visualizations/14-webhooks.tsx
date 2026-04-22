"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#F59E0B";
const steps = ["External Service", "HTTP Request", "Gateway Webhook", "Agent Processes"];

const nodes = [
  { label: "GitHub", sub: "Push Event", x: 40, y: 100, w: 110, h: 55 },
  { label: "HTTP POST", sub: "/webhook", x: 210, y: 100, w: 110, h: 55 },
  { label: "Gateway", sub: "Webhook Handler", x: 380, y: 100, w: 120, h: 55 },
  { label: "Agent", sub: "Process", x: 380, y: 210, w: 120, h: 55 },
];

export default function WebhooksVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Webhook Request Flow</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 560 310" className="w-full max-w-lg mx-auto" style={{ maxHeight: 330 }}>
        {nodes.map((node, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          return (
            <g key={node.label}>
              <motion.rect x={node.x} y={node.y} width={node.w} height={node.h} rx={10}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2.5 : 1}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4 }} />
              <motion.text x={node.x + node.w / 2} y={node.y + node.h / 2 - 4}
                textAnchor="middle" fontSize={13} fontWeight="bold"
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

        {/* Horizontal arrows */}
        {[0, 1].map((i) => {
          const from = nodes[i];
          const to = nodes[i + 1];
          return (
            <motion.line key={i}
              x1={from.x + from.w} y1={from.y + from.h / 2}
              x2={to.x} y2={to.y + to.h / 2}
              stroke={color} strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={currentStep > i ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5 }} />
          );
        })}

        {/* Vertical arrow to Agent */}
        <motion.line x1={440} y1={155} x2={440} y2={210} stroke={color} strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={currentStep >= 3 ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5 }} />

        {/* HTTP method badge */}
        {currentStep >= 1 && (
          <motion.rect x={175} y={60} width={180} height={24} rx={12} fill={`${color}20`} stroke={color} strokeWidth={1}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        {currentStep >= 1 && (
          <motion.text x={265} y={77} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={color}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            POST https://gw.hook/receive
          </motion.text>
        )}

        <motion.text x={280} y={300} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "An external service (e.g., GitHub) triggers an event",
            "An HTTP POST request is sent to the Gateway endpoint",
            "Gateway webhook handler receives and validates the payload",
            "The configured agent processes the webhook data"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
