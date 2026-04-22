"use client";
import { useState } from "react";
import { Search, Plus, Brain } from "lucide-react";

interface MemoryEntry {
  id: number;
  content: string;
  timestamp: string;
  source: string;
}

export function MemoryDemo() {
  const [entries, setEntries] = useState<MemoryEntry[]>([
    { id: 1, content: "User prefers TypeScript over JavaScript", timestamp: "2024-01-15", source: "conversation" },
    { id: 2, content: "User is working on a web project", timestamp: "2024-01-16", source: "conversation" },
    { id: 3, content: "User's timezone is UTC+8", timestamp: "2024-01-17", source: "explicit" },
  ]);
  const [newMemory, setNewMemory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addMemory = () => {
    if (!newMemory.trim()) return;
    setEntries((prev) => [
      ...prev,
      { id: Date.now(), content: newMemory, timestamp: new Date().toISOString().split("T")[0], source: "manual" },
    ]);
    setNewMemory("");
  };

  const filtered = searchQuery
    ? entries.filter((e) => e.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  return (
    <div className="space-y-4">
      {/* Store */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMemory()}
            placeholder="Store a memory..."
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <button onClick={addMemory} className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700">
          Store
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] pl-9 pr-3 py-2 text-sm"
        />
      </div>

      {/* Entries */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Brain size={14} />
          {filtered.length} memories
        </div>
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded-md border border-[var(--border-color)] p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-purple-500">{entry.source}</span>
              <span className="text-xs text-[var(--text-secondary)]">{entry.timestamp}</span>
            </div>
            <p className="text-sm">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
