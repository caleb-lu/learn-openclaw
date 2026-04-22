"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getWeekBgClass } from "@/lib/utils";
import { WEEKS, LESSON_META, type LessonSlug } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, Circle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { locale } = useI18n();

  return (
    <nav className="hidden w-56 shrink-0 overflow-y-auto border-r border-[var(--border-color)] pr-6 py-6 lg:block">
      <div className="space-y-5">
        {WEEKS.map((week) => (
          <div key={week.number}>
            <div className={cn("mb-2 text-xs font-semibold uppercase tracking-wider", getWeekBgClass(week.number), "rounded-md px-2 py-1 inline-block")}>
              W{week.number}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-2 px-2">
              {week.title[locale]}
            </p>
            <ul className="space-y-0.5">
              {week.lessons.map((slug) => {
                const meta = LESSON_META[slug];
                const isActive = pathname === `/${locale}/${slug}` || pathname === `/${locale}/${slug}/`;
                const isCompleted = false; // Will use useProgress in real impl

                return (
                  <li key={slug}>
                    <Link
                      href={`/${locale}/${slug}`}
                      className={cn(
                        "flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-[var(--bg-card)] font-medium text-[var(--text-primary)] shadow-sm"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle size={14} className="mt-0.5 shrink-0" />
                      )}
                      <span className="leading-tight">{meta.title[locale]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
