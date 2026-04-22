"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { WEEKS, LESSON_META, type Locale, type LessonSlug } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, getWeekColor, formatDuration } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export default function TimelinePage() {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {locale === "zh" ? "学习时间线" : "Learning Timeline"}
      </h1>
      <p className="text-[var(--text-secondary)] mb-10">
        {locale === "zh"
          ? "4 周 17 课，从部署到自动化，系统掌握 OpenClaw"
          : "4 weeks, 17 lessons — from deployment to automation"}
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />

        {WEEKS.map((week, weekIdx) => (
          <div key={week.number} className="mb-12">
            {/* Week header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: weekIdx * 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div
                className="z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: week.color }}
              >
                W{week.number}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{week.title[locale]}</h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {week.lessons.length} {locale === "zh" ? "节课" : "lessons"}
                </p>
              </div>
            </motion.div>

            {/* Lessons */}
            <div className="ml-5 space-y-3 border-l-2 pl-8" style={{ borderColor: `${week.color}33` }}>
              {week.lessons.map((slug, lessonIdx) => {
                const meta = LESSON_META[slug];
                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: weekIdx * 0.1 + lessonIdx * 0.05 }}
                  >
                    <Link href={`/${locale}/${slug}`}>
                      <Card hover className="flex items-center gap-4">
                        <Circle size={16} className="shrink-0" style={{ color: week.color }} />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">
                            <span className="text-[var(--text-secondary)] mr-2">#{meta.number}</span>
                            {meta.title[locale]}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {meta.description[locale]}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] shrink-0">
                          <Clock size={12} />
                          {formatDuration(meta.duration)}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
