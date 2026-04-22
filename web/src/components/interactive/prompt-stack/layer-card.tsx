"use client";

import { motion } from "framer-motion";

export interface LayerCardProps {
  index: number;
  name: string;
  source: string;
  description: string;
  color: string;
  isRevealed: boolean;
  revealDelay: number;
}

export function LayerCard({
  index,
  name,
  source,
  description,
  color,
  isRevealed,
  revealDelay,
}: LayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scaleY: 0.95 }}
      animate={
        isRevealed
          ? { opacity: 1, x: 0, scaleY: 1 }
          : { opacity: 0, x: -20, scaleY: 0.95 }
      }
      transition={{
        duration: 0.3,
        delay: revealDelay,
        ease: "easeOut",
      }}
      className="group rounded-lg border p-3 transition-shadow hover:shadow-md"
      style={{
        borderColor: `${color}44`,
        backgroundColor: `${color}11`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-mono font-bold"
            style={{
              color: color,
              backgroundColor: `${color}22`,
            }}
          >
            L{index + 1}
          </span>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-xs text-[var(--text-secondary)] font-mono">
          {source}
        </span>
      </div>

      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={
          isRevealed
            ? { opacity: 1, height: "auto" }
            : { opacity: 0, height: 0 }
        }
        transition={{ duration: 0.2, delay: revealDelay + 0.15 }}
        className="text-xs text-[var(--text-secondary)] mt-1.5 ml-9 overflow-hidden"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
