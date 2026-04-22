"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Clock, CheckCircle2 } from "lucide-react";
import { WEEKS, LESSON_META, LESSON_ORDER, type Locale } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeekColor } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const PROGRESS_KEY = "learn-openclaw-progress";

function getCompleted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function toggleComplete(slug: string) {
  const completed = getCompleted();
  if (completed.has(slug)) completed.delete(slug);
  else completed.add(slug);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
}

export default function DashboardPage() {
  const { locale } = useI18n();

  const completed = useMemo(() => getCompleted(), []);

  const totalLessons = LESSON_ORDER.length;
  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const weekProgress = WEEKS.map((week) => {
    const total = week.lessons.length;
    const done = week.lessons.filter((s) => completed.has(s)).length;
    return { ...week, total, done };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {locale === "zh" ? "学习进度" : "Learning Progress"}
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        {locale === "zh"
          ? `已完成 ${completedCount}/${totalLessons} 课 (${progressPct}%)`
          : `${completedCount}/${totalLessons} lessons completed (${progressPct}%)`}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-2 text-amber-500">
            <Trophy size={20} />
            <span className="text-2xl font-bold">{completedCount}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {locale === "zh" ? "已完成" : "Completed"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-blue-500">
            <Target size={20} />
            <span className="text-2xl font-bold">{totalLessons - completedCount}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {locale === "zh" ? "剩余" : "Remaining"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-emerald-500">
            <Clock size={20} />
            <span className="text-2xl font-bold">{progressPct}%</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {locale === "zh" ? "进度" : "Progress"}
          </p>
        </Card>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-3 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Week progress */}
      <div className="space-y-6">
        {weekProgress.map((week) => {
          const pct = week.total > 0 ? Math.round((week.done / week.total) * 100) : 0;
          return (
            <div key={week.number}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: week.color }}
                  />
                  <span className="font-medium text-sm">W{week.number}: {week.title[locale]}</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {week.done}/{week.total}
                </span>
              </div>
              <div className="space-y-1">
                {week.lessons.map((slug) => {
                  const meta = LESSON_META[slug];
                  const isComplete = completed.has(slug);
                  return (
                    <button
                      key={slug}
                      onClick={() => toggleComplete(slug)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      {isComplete ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-[var(--border-color)] shrink-0" />
                      )}
                      <span className={isComplete ? "line-through text-[var(--text-secondary)]" : ""}>
                        #{meta.number} {meta.title[locale]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
