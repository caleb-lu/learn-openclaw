"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LESSON_META, getAdjacentLessons, type LessonSlug } from "@/lib/constants";
import type { Locale } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LessonNav({
  currentSlug,
  locale,
}: {
  currentSlug: LessonSlug;
  locale: Locale;
}) {
  const { prev, next } = getAdjacentLessons(currentSlug);

  return (
    <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4 mt-8">
      {prev ? (
        <Link
          href={`/${locale}/${prev}`}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">{LESSON_META[prev].title[locale]}</span>
          <span className="sm:hidden">Prev</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/${locale}/${next}`}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span className="hidden sm:inline">{LESSON_META[next].title[locale]}</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
