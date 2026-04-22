"use client";

import { Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WeekBadge } from "@/components/ui/week-badge";
import { LESSON_META, type LessonSlug, type Locale } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";

export function LessonHeader({
  slug,
  locale,
}: {
  slug: LessonSlug;
  locale: Locale;
}) {
  const meta = LESSON_META[slug];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <Badge>#{meta.number}</Badge>
        <WeekBadge week={meta.week} locale={locale} />
      </div>
      <h1 className="text-3xl font-bold mb-2">{meta.title[locale]}</h1>
      <p className="text-lg text-[var(--text-secondary)] mb-4">
        {meta.description[locale]}
      </p>
      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {formatDuration(meta.duration)}
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen size={14} />
          Lesson {meta.number} of 17
        </span>
      </div>
    </div>
  );
}
