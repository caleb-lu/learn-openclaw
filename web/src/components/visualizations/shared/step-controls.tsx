"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  labels?: string[];
}

export function StepControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  labels,
}: StepControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-color)] px-3 py-1.5 text-sm disabled:opacity-30 hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <ChevronLeft size={14} />
        Prev
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button
            key={i}
            onClick={() => {}}
            className={cn(
              "h-2 rounded-full transition-all",
              i === currentStep
                ? "w-6 bg-blue-500"
                : i < currentStep
                  ? "w-2 bg-blue-300"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
        <span className="ml-2 text-xs text-[var(--text-secondary)]">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-30 hover:bg-blue-700 transition-colors"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
