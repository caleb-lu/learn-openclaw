"use client";

import { useState, useCallback } from "react";
import type { Scenario, ScenarioStep } from "@/types/lesson-data";

export interface SimulatorState {
  currentStep: number;
  isComplete: boolean;
  state: Record<string, unknown>;
  outputs: string[];
}

export function useSimulator(scenario: Scenario | null) {
  const [simState, setSimState] = useState<SimulatorState>({
    currentStep: 0,
    isComplete: false,
    state: scenario?.initialState ?? {},
    outputs: [],
  });

  const reset = useCallback(() => {
    setSimState({
      currentStep: 0,
      isComplete: false,
      state: scenario?.initialState ?? {},
      outputs: [],
    });
  }, [scenario]);

  const nextStep = useCallback(() => {
    if (!scenario) return;

    setSimState((prev) => {
      const step = scenario.steps[prev.currentStep];
      if (!step) return prev;

      const newOutputs = [...prev.outputs];
      if (step.expectedOutput) {
        newOutputs.push(step.expectedOutput);
      }

      const newState = step.nextState
        ? { ...prev.state, ...step.nextState }
        : prev.state;

      const nextStep = prev.currentStep + 1;
      const isComplete = nextStep >= scenario.steps.length;

      return {
        currentStep: nextStep,
        isComplete,
        state: newState,
        outputs: newOutputs,
      };
    });
  }, [scenario]);

  const currentStep: ScenarioStep | null =
    scenario?.steps[simState.currentStep] ?? null;

  return {
    ...simState,
    currentStep,
    currentStepIndex: simState.currentStep,
    scenario,
    nextStep,
    reset,
  };
}
