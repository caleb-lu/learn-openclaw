"use client";

import { motion } from "framer-motion";

interface A2UINode {
  type: "card" | "list" | "button" | "text" | "heading" | "container";
  props?: Record<string, string | number | boolean>;
  children?: A2UINode[];
  content?: string;
}

export function A2UIRenderer({ json }: { json: string }) {
  let parsed: A2UINode;
  try {
    parsed = JSON.parse(json);
  } catch {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
        Invalid JSON. Cannot render.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
      <div className="space-y-2">
        {renderNode(parsed, 0)}
      </div>
    </div>
  );
}

function renderNode(node: A2UINode, depth: number): React.ReactNode {
  switch (node.type) {
    case "container":
      return (
        <motion.div
          key={depth}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: depth * 0.05 }}
          className="space-y-2"
          style={{ padding: (node.props?.padding as number) ?? 0 }}
        >
          {node.children?.map((child, i) => renderNode(child, depth + 1))}
        </motion.div>
      );

    case "heading":
      return (
        <motion.h3
          key={depth}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.05 }}
          className={`font-semibold text-[var(--text-primary)] ${
            (node.props?.size as string) === "lg" ? "text-lg" : "text-base"
          }`}
        >
          {node.content}
        </motion.h3>
      );

    case "text":
      return (
        <motion.p
          key={depth}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: depth * 0.05 }}
          className="text-sm text-[var(--text-secondary)]"
        >
          {node.content}
        </motion.p>
      );

    case "card":
      return (
        <motion.div
          key={depth}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: depth * 0.05 }}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
        >
          {node.content && (
            <h4 className="font-medium text-sm mb-2">{node.content}</h4>
          )}
          {node.children?.map((child, i) => renderNode(child, depth + 1))}
        </motion.div>
      );

    case "list":
      return (
        <motion.ul
          key={depth}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: depth * 0.05 }}
          className="space-y-1"
        >
          {node.children?.map((child, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              {child.content ?? JSON.stringify(child)}
            </li>
          ))}
        </motion.ul>
      );

    case "button":
      return (
        <motion.button
          key={depth}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: depth * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            (node.props?.variant as string) === "primary"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : (node.props?.variant as string) === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          {node.content}
        </motion.button>
      );

    default:
      return (
        <div key={depth} className="text-xs text-[var(--text-secondary)] font-mono p-2 rounded bg-[var(--bg-secondary)]">
          Unknown node type: {node.type}
        </div>
      );
  }
}
