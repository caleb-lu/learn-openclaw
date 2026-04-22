"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export interface MemoryEntry {
  id: number;
  content: string;
  timestamp: string;
  source: string;
}

interface MemorySearchProps {
  entries: MemoryEntry[];
}

export function MemorySearch({ entries }: MemorySearchProps) {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? entries.filter((e) =>
        e.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] pl-9 pr-8 py-2 text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-[var(--text-secondary)]"
          >
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </motion.div>
        )}

        {results.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-md border border-purple-500/20 bg-purple-500/5 p-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-purple-400">{entry.source}</span>
              <span className="text-xs text-[var(--text-secondary)]">{entry.timestamp}</span>
            </div>
            <p className="text-sm">
              {highlightMatch(entry.content, query)}
            </p>
          </motion.div>
        ))}

        {query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 text-sm text-[var(--text-secondary)]"
          >
            No matching memories found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-purple-500/30 text-purple-300 rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
