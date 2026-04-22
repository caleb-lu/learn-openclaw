"use client";

import { motion } from "framer-motion";
import { CHANNEL_NODES, SINGLE_CHANNEL_EDGES } from "./nodes";
import { RoutingTable } from "./routing-table";
import { useState } from "react";

export function ChannelFlow() {
  const [view, setView] = useState<"flow" | "table">("flow");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setView("flow")}
          className="rounded-md px-3 py-1.5 text-sm font-medium bg-blue-600 text-white"
        >
          Flow View
        </button>
        <button
          onClick={() => setView("table")}
          className="rounded-md px-3 py-1.5 text-sm font-medium border border-[var(--border-color)]"
        >
          Routing Table
        </button>
      </div>

      {view === "flow" ? (
        <div className="relative rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 overflow-hidden" style={{ minHeight: 200 }}>
          <svg viewBox="0 0 800 200" className="w-full h-auto">
            {/* Edges */}
            {SINGLE_CHANNEL_EDGES.map((edge, i) => {
              const fromNode = CHANNEL_NODES.find((n) => n.id === edge.from);
              const toNode = CHANNEL_NODES.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              const positions: Record<string, { x: number; y: number }> = {
                telegram: { x: 100, y: 100 },
                gateway: { x: 300, y: 100 },
                router: { x: 400, y: 100 },
                agent: { x: 550, y: 100 },
                model: { x: 700, y: 100 },
              };
              const from = positions[edge.from];
              const to = positions[edge.to];
              if (!from || !to) return null;
              return (
                <motion.line
                  key={i}
                  x1={from.x + 30}
                  y1={from.y}
                  x2={to.x - 30}
                  y2={to.y}
                  stroke={edge.from === "model" || edge.from === "agent" ? "#10B981" : "#64748b"}
                  strokeWidth={1.5}
                  strokeDasharray={edge.label ? "4 2" : "none"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  markerEnd="url(#arrow)"
                />
              );
            })}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
            </defs>

            {/* Nodes */}
            {["telegram", "gateway", "router", "agent", "model"].map((id, i) => {
              const node = CHANNEL_NODES.find((n) => n.id === id);
              if (!node) return null;
              const positions: Record<string, { x: number; y: number }> = {
                telegram: { x: 100, y: 100 },
                gateway: { x: 300, y: 100 },
                router: { x: 400, y: 100 },
                agent: { x: 550, y: 100 },
                model: { x: 700, y: 100 },
              };
              const pos = positions[id];
              if (!pos) return null;
              return (
                <motion.g
                  key={id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <rect x={pos.x - 30} y={pos.y - 20} width={60} height={40} rx={8} fill={node.color} opacity={0.15} stroke={node.color} strokeWidth={1.5} />
                  <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize="14">{node.icon}</text>
                  <text x={pos.x} y={pos.y + 14} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">{node.label}</text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      ) : (
        <RoutingTable />
      )}
    </div>
  );
}
