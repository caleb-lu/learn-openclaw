"use client";

import { useState, useCallback } from "react";
import { JsonEditor } from "@/components/ui/json-editor";
import { CONFIG_PRESETS } from "./presets";
import { validateConfig, type ValidationResult } from "./validator";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfigEditor() {
  const [config, setConfig] = useState(CONFIG_PRESETS[0].config);
  const [activePreset, setActivePreset] = useState(CONFIG_PRESETS[0].id);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    setValidation(validateConfig(config));
  }, [config]);

  const handlePresetChange = useCallback((preset: typeof CONFIG_PRESETS[0]) => {
    setConfig(preset.config);
    setActivePreset(preset.id);
    setValidation(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Preset selector */}
      <div className="flex flex-wrap gap-2">
        {CONFIG_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetChange(preset)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activePreset === preset.id
                ? "bg-blue-600 text-white"
                : "border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <JsonEditor value={config} onChange={(v) => { setConfig(v); setValidation(null); }} language="json5" height="300px" />

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={handleValidate} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">
          Validate
        </button>
      </div>

      {/* Results */}
      {validation && (
        <div className="space-y-2">
          {validation.valid ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle2 size={16} />
              Configuration is valid
            </div>
          ) : (
            validation.errors.map((err, i) => (
              <div key={i} className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} />
                <span className="font-mono text-xs">{err.path}</span>: {err.message}
              </div>
            ))
          )}
          {validation.warnings.map((warn, i) => (
            <div key={i} className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
              <AlertTriangle size={16} />
              <span className="font-mono text-xs">{warn.path}</span>: {warn.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
