export interface ConfigPreset {
  id: string;
  name: string;
  description: string;
  config: string;
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Basic configuration with CLI channel only",
    config: '{\n  name: "my-assistant",\n  model: {\n    provider: "openai",\n    model: "gpt-4o",\n  },\n  channels: [\n    { type: "cli", enabled: true },\n  ],\n}',
  },
  {
    id: "webchat",
    name: "Web Chat",
    description: "Add web chat interface",
    config: '{\n  name: "web-assistant",\n  model: {\n    provider: "openai",\n    model: "gpt-4o",\n  },\n  channels: [\n    { type: "cli", enabled: true },\n    { type: "webchat", enabled: true, config: { port: 3000 } },\n  ],\n}',
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    description: "Connect Telegram bot channel",
    config: '{\n  name: "telegram-bot",\n  model: {\n    provider: "openai",\n    model: "gpt-4o",\n  },\n  channels: [\n    { type: "cli", enabled: true },\n    { type: "telegram", enabled: true, config: { botToken: "${TELEGRAM_BOT_TOKEN}" } },\n  ],\n}',
  },
  {
    id: "full",
    name: "Full Config",
    description: "Complete configuration with all features",
    config: '{\n  name: "full-assistant",\n  model: {\n    provider: "openai",\n    model: "gpt-4o",\n    temperature: 0.7,\n  },\n  channels: [\n    { type: "cli", enabled: true },\n    { type: "webchat", enabled: true },\n    { type: "telegram", enabled: true, config: { botToken: "${TELEGRAM_BOT_TOKEN}" } },\n  ],\n  memory: { enabled: true, autoRecall: true },\n  automation: [\n    { name: "morning", trigger: { type: "cron", expression: "0 9 * * *" }, action: { type: "chat", message: "Good morning!", channel: "cli" } },\n  ],\n}',
  },
];
