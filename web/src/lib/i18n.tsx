"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/constants";
import en from "@/i18n/messages/en.json";
import zh from "@/i18n/messages/zh.json";

const messagesMap: Record<Locale, typeof en> = { en, zh };

export function getMessages(locale: Locale) {
  return messagesMap[locale];
}

type Messages = typeof en;
const I18nContext = createContext<{ locale: Locale; messages: Messages }>({
  locale: "en",
  messages: en,
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, messages: messagesMap[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function t(messages: Messages, key: string): string {
  const keys = key.split(".");
  let current: unknown = messages;
  for (const k of keys) {
    if (current && typeof current === "object" && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}
