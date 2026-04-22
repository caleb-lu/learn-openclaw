export interface ConfigSchema {
  key: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
  default?: unknown;
  children?: ConfigSchema[];
  options?: string[];
}

export const OPENCLAW_SCHEMA: ConfigSchema[] = [
  {
    key: "name",
    type: "string",
    description: "Assistant name",
    required: true,
    default: "my-assistant",
  },
  {
    key: "model",
    type: "object",
    description: "Model configuration",
    required: true,
    children: [
      { key: "provider", type: "string", description: "AI provider", required: true, options: ["openai", "anthropic", "google", "local"] },
      { key: "model", type: "string", description: "Model name", required: true },
      { key: "temperature", type: "number", description: "Temperature (0-1)", required: false, default: 0.7 },
      { key: "maxTokens", type: "number", description: "Max output tokens", required: false, default: 4096 },
    ],
  },
  {
    key: "channels",
    type: "array",
    description: "Channel configurations",
    required: false,
    default: [],
  },
  {
    key: "agents",
    type: "array",
    description: "Agent configurations",
    required: false,
    default: [],
  },
  {
    key: "memory",
    type: "object",
    description: "Memory system config",
    required: false,
    children: [
      { key: "enabled", type: "boolean", description: "Enable memory", required: false, default: true },
      { key: "maxEntries", type: "number", description: "Max memory entries", required: false, default: 1000 },
      { key: "autoRecall", type: "boolean", description: "Auto recall context", required: false, default: true },
    ],
  },
  {
    key: "automation",
    type: "array",
    description: "Automation rules",
    required: false,
    default: [],
  },
];
