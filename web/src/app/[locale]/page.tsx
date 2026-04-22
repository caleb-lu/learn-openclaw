"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, MessageSquare, Cpu, Zap } from "lucide-react";
import { WEEKS, LESSON_META, type Locale, type LessonSlug } from "@/lib/constants";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { WeekBadge } from "@/components/ui/week-badge";
import { useI18n } from "@/lib/i18n";
import { getWeekBgClass } from "@/lib/utils";

export default function HomePage() {
  const { locale } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {locale === "zh"
            ? "构建你的 24/7 个人 AI 助手"
            : "Build Your 24/7 Personal AI Assistant"}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          {locale === "zh"
            ? "覆盖 OpenClaw 完整平台的动手实战营 — 从部署到智能自动化"
            : "A hands-on, interactive bootcamp covering the complete OpenClaw platform — from deployment to intelligent automation"}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/${locale}/${LESSON_ORDER[0]}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {locale === "zh" ? "开始学习" : "Start Learning"}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`/${locale}/timeline`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {locale === "zh" ? "查看时间线" : "View Timeline"}
          </Link>
        </div>
      </motion.div>

      {/* Learning Path */}
      <h2 className="text-2xl font-bold mb-6">
        {locale === "zh" ? "学习路径" : "Learning Path"}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 mb-16">
        {WEEKS.map((week, i) => (
          <motion.div
            key={week.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="h-full">
              <WeekBadge week={week.number} locale={locale} />
              <CardTitle className="mt-3">{week.title[locale]}</CardTitle>
              <CardDescription className="mt-2">
                {week.lessons
                  .map((s) => LESSON_META[s].title[locale])
                  .join(" → ")}
              </CardDescription>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Architecture Overview */}
      <h2 className="text-2xl font-bold mb-6">
        {locale === "zh" ? "架构概览" : "Architecture Overview"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Layers, title: locale === "zh" ? "部署配置" : "Deploy", desc: locale === "zh" ? "Docker/npm 安装" : "Docker/npm install", week: 1 },
          { icon: MessageSquare, title: locale === "zh" ? "渠道路由" : "Channels", desc: locale === "zh" ? "25+ 消息平台" : "25+ messaging platforms", week: 2 },
          { icon: Cpu, title: locale === "zh" ? "智能记忆" : "Intelligence", desc: locale === "zh" ? "8 层 Prompt + 记忆" : "8-layer prompt + memory", week: 3 },
          { icon: Zap, title: locale === "zh" ? "自动化" : "Automation", desc: locale === "zh" ? "定时任务 + Webhook" : "Scheduled + webhook", week: 4 },
        ].map((item) => (
          <Card key={item.week}>
            <div className={`inline-flex rounded-lg p-2.5 ${getWeekBgClass(item.week)}`}>
              <item.icon size={20} />
            </div>
            <CardTitle className="mt-3 text-base">{item.title}</CardTitle>
            <CardDescription>{item.desc}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}

const LESSON_ORDER = [
  "01-installation",
  "02-configuration",
  "03-workspace",
  "04-first-conversation",
  "05-channel-setup",
  "06-multi-channel",
  "07-routing-rules",
  "08-multi-agent",
  "09-prompt-engineering",
  "10-memory-system",
  "11-skill-installation",
  "12-custom-skills",
  "13-scheduled-tasks",
  "14-webhooks",
  "15-canvas-a2ui",
  "16-voice-nodes",
  "17-capstone",
] as const;
