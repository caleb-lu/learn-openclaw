"use client";

import { motion } from "framer-motion";
import { useSteppedVisualization } from "@/hooks/useSteppedVisualization";
import { StepControls } from "./shared/step-controls";

const color = "#F59E0B";
const steps = ["Define Cron Expression", "Scheduler Receives", "Agent Executes", "Result Sent"];

const timelineEvents = [
  { label: "Cron Defined", time: "T+0s", x: 60 },
  { label: "Scheduler\nTriggered", time: "T+interval", x: 190 },
  { label: "Agent\nExecutes", time: "T+1s", x: 330 },
  { label: "Result\nDelivered", time: "T+2s", x: 460 },
];

export default function ScheduledTasksVisualization() {
  const { currentStep, next, prev, reset } = useSteppedVisualization(4);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <h3 className="text-lg font-semibold mb-1">Cron Timeline</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Step {currentStep + 1}: {steps[currentStep]}
      </p>

      <motion.svg viewBox="0 0 560 280" className="w-full max-w-xl mx-auto" style={{ maxHeight: 300 }}>
        {/* Timeline axis */}
        <motion.line x1={40} y1={130} x2={520} y2={130}
          stroke="var(--border-color)" strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

        {/* Timeline events */}
        {timelineEvents.map((event, i) => {
          const show = currentStep >= i;
          const active = currentStep === i;
          const lines = event.label.split("\n");
          return (
            <g key={event.label}>
              {/* Dot on timeline */}
              <motion.circle cx={event.x} cy={130} r={active ? 8 : 5}
                fill={show ? color : "var(--border-color)"}
                stroke={active ? color : "transparent"} strokeWidth={3}
                initial={{ scale: 0 }}
                animate={show ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }} />

              {/* Time label */}
              <motion.text x={event.x} y={160} textAnchor="middle" fontSize={10}
                fill="var(--text-secondary)"
                initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 }}>
                {event.time}
              </motion.text>

              {/* Event card */}
              <motion.rect x={event.x - 50} y={50} width={100} height={50} rx={8}
                fill={active ? `${color}25` : show ? `${color}10` : "transparent"}
                stroke={color} strokeWidth={active ? 2 : 1}
                initial={{ opacity: 0, y: -15 }}
                animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }} />

              {lines.map((line, li) => (
                <motion.text key={li} x={event.x} y={71 + li * 14}
                  textAnchor="middle" fontSize={11}
                  fontWeight={active ? "bold" : "normal"}
                  fill={active ? color : "var(--text-primary)"}
                  initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : { opacity: 0 }}>
                  {line}
                </motion.text>
              ))}

              {/* Connector line */}
              <motion.line x1={event.x} y1={100} x2={event.x} y2={125}
                stroke={color} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={show ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.3 }} />
            </g>
          );
        })}

        {/* Cron expression display */}
        {currentStep === 0 && (
          <motion.rect x={120} y={185} width={320} height={36} rx={6}
            fill="#1e1e2e" stroke="#444"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          </motion.rect>
        )}
        {currentStep === 0 && (
          <motion.text x={280} y={208} textAnchor="middle" fontSize={12}
            fontFamily="monospace" fill="#F59E0B"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            0 * * * * (every hour)
          </motion.text>
        )}

        <motion.text x={280} y={270} textAnchor="middle" fontSize={11} fill="var(--text-secondary)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentStep}>
          {[
            "Define a cron expression in openclaw.json",
            "Scheduler evaluates expression and triggers at the right time",
            "Agent receives the task and executes the action",
            "Result is delivered back to the configured channel"
          ][currentStep]}
        </motion.text>
      </motion.svg>

      <StepControls currentStep={currentStep} totalSteps={4} onPrev={prev} onNext={next} onReset={reset} labels={steps} />
    </div>
  );
}
