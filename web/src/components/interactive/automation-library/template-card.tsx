"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Copy, Check } from "lucide-react";

export interface AutomationTemplate {
  id: string;
  name: string;
  type: "cron" | "webhook";
  trigger: string;
  description: string;
  config: string;
}

interface TemplateCardProps {
  template: AutomationTemplate;
}

const TYPE_STYLES = {
  cron: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    label: "Cron",
  },
  webhook: {
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    label: "Webhook",
  },
};

export function TemplateCard({ template }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);
  const style = TYPE_STYLES[template.type];
  const Icon = style.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-lg border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow bg-[var(--bg-card)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center justify-center w-7 h-7 rounded-md ${style.bgColor}`}>
            <Icon size={14} className={style.color} />
          </div>
          <div>
            <span className="font-medium text-sm">{template.name}</span>
            <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded ${style.bgColor} ${style.color}`}>
              {style.label}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded ${style.bgColor} ${style.color}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Active
        </div>
      </div>

      {/* Trigger */}
      <div className="mb-2">
        <span className="text-xs text-[var(--text-secondary)]">Trigger: </span>
        <code className="text-xs font-mono bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
          {template.trigger}
        </code>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] mb-3">
        {template.description}
      </p>

      {/* Actions */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
      >
        {copied ? (
          <>
            <Check size={12} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy Config
          </>
        )}
      </button>
    </motion.div>
  );
}
