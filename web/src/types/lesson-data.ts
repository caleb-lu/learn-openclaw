import type { Locale } from "@/lib/constants";

export interface LessonData {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  content: string;
  objectives: string[];
  prerequisites: string[];
  duration: number;
  week: number;
  hasCodeSamples: boolean;
  codeSamples?: CodeSample[];
}

export interface CodeSample {
  id: string;
  filename: string;
  language: string;
  content: string;
  description?: string;
}

export interface GeneratedLessons {
  lessons: Record<Locale, Record<string, LessonData>>;
  generatedAt: string;
}

export interface GeneratedTemplates {
  configs: Record<string, { filename: string; content: string; description: string }>;
  workspaces: Record<string, Record<string, { filename: string; content: string; description: string }>>;
  skills: Record<string, { name: string; content: string; description: string }>;
  automations: Record<string, { name: string; content: string; description: string }>;
}

export interface ScenarioStep {
  instruction: string;
  action?: string;
  expectedOutput?: string;
  userAction?: string;
  nextState?: Record<string, unknown>;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  initialState: Record<string, unknown>;
  steps: ScenarioStep[];
  completionMessage: string;
}
