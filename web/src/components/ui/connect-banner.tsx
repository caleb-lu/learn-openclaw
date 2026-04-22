"use client";

import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionState } from "@/types/gateway";
import { useI18n } from "@/lib/i18n";

export function ConnectBanner({ state }: { state: ConnectionState }) {
  const { locale, messages } = useI18n();
  const msgs = messages as Record<string, Record<string, string>>;

  if (state === "connected") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm",
        state === "connecting"
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
          : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      )}
    >
      {state === "connecting" ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <WifiOff size={16} />
      )}
      <span>
        {state === "connecting"
          ? (msgs.gateway?.connecting ?? "Connecting...")
          : (msgs.gateway?.disconnected ?? "Connect Gateway for live features")}
      </span>
      {state === "disconnected" && (
        <button className="ml-auto rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
          <Wifi size={12} className="inline mr-1" />
          Connect
        </button>
      )}
    </div>
  );
}
