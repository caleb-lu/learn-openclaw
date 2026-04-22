"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "learn-openclaw-progress";

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCompleted(new Set(JSON.parse(raw)));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback((slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (slug: string) => completed.has(slug),
    [completed]
  );

  const completedCount = completed.size;
  const totalCount = 17;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    completed,
    completedCount,
    totalCount,
    percentage,
    toggle,
    isCompleted,
  };
}
