import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { LESSON_ORDER, LOCALES } from "@/lib/constants";
import type { LessonSlug, Locale } from "@/lib/constants";
import { LessonClient } from "./client";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    (LESSON_ORDER as readonly string[]).map((lesson) => ({
      locale,
      lesson,
    }))
  );
}

const ROOT = path.resolve(process.cwd(), "..");

async function getLessonContent(locale: string, slug: string): Promise<string | null> {
  try {
    const filePath = path.join(ROOT, "lessons", locale, `${slug}.md`);
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function getScenario(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const filePath = path.join(ROOT, "web", "src", "data", "scenarios", `${slug}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; lesson: string }>;
}) {
  const { locale, lesson } = await params;
  const validLocale = (locale === "zh" ? "zh" : "en") as Locale;

  if (!(LESSON_ORDER as readonly string[]).includes(lesson)) {
    notFound();
  }

  const slug = lesson as LessonSlug;
  const content = await getLessonContent(validLocale, slug);
  const scenario = await getScenario(slug);

  return (
    <LessonClient
      locale={validLocale}
      slug={slug}
      content={content ?? ""}
      scenario={scenario}
    />
  );
}
