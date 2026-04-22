"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sun, Moon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const { locale, messages } = useI18n();
  const msgs = messages as Record<string, Record<string, string>>;
  const nav = msgs.nav ?? {};

  const links = [
    { href: `/${locale}/timeline`, label: nav.timeline ?? "Timeline" },
    { href: `/${locale}/playground`, label: nav.playground ?? "Playground" },
    { href: `/${locale}/dashboard`, label: nav.dashboard ?? "Dashboard" },
  ];

  const otherLocale: Locale = locale === "en" ? "zh" : "en";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen size={20} className="text-blue-500" />
          <span className="hidden sm:inline">Learn OpenClaw</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === link.href || pathname === link.href + "/"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2 border-l border-[var(--border-color)] pl-2 flex items-center gap-1">
            <DarkModeToggle />
            <Link
              href={pathname.replace(`/${locale}`, `/${otherLocale}`)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <Globe size={14} />
              {otherLocale.toUpperCase()}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function DarkModeToggle() {
  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDark}
      className="rounded-md p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
      title="Toggle dark mode"
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="block dark:hidden" />
    </button>
  );
}
