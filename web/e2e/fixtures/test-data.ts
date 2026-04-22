export const LESSON_SLUGS = [
  "01-installation",
  "02-configuration",
  "03-workspace",
  "04-first-conversation",
  "05-channel-setup",
  "06-multi-channel",
  "07-routing-rules",
  "08-multi-agent",
  "09-prompt-engineering",
  "10-memory-system",
  "11-skill-installation",
  "12-custom-skills",
  "13-scheduled-tasks",
  "14-webhooks",
  "15-canvas-a2ui",
  "16-voice-nodes",
  "17-capstone",
] as const;

export const LOCALES = ["en", "zh"] as const;

export const LESSONS_WITH_CODE = new Set([
  "01-installation",
  "02-configuration",
  "03-workspace",
  "09-prompt-engineering",
  "13-scheduled-tasks",
]);

export const LESSON_TITLES_EN: Record<string, string> = {
  "01-installation": "Installation & Deployment",
  "02-configuration": "Configuration Deep Dive",
  "03-workspace": "Workspace & Personality",
  "04-first-conversation": "Your First Conversation",
  "05-channel-setup": "Channel Setup",
  "06-multi-channel": "Multi-Channel Coordination",
  "07-routing-rules": "Routing Rules",
  "08-multi-agent": "Multi-Agent Setup",
  "09-prompt-engineering": "Prompt Engineering",
  "10-memory-system": "Memory System",
  "11-skill-installation": "Skill Installation",
  "12-custom-skills": "Custom Skills",
  "13-scheduled-tasks": "Scheduled Tasks",
  "14-webhooks": "Webhooks",
  "15-canvas-a2ui": "Canvas & A2UI",
  "16-voice-nodes": "Voice & Nodes",
  "17-capstone": "Capstone: Your 24/7 AI Assistant",
};

export const SEL = {
  header: "header",
  sidebar: "nav.hidden",
  tabsContainer: "div.border-b",
  tabButton: (label: string) => `div.border-b button:has-text("${label}")`,
  tabContent: ".py-6",
  prose: ".prose",
  lessonTitle: "h1.text-3xl",
  badge: "span.inline-flex.items-center",
  nextStepBtn: "button:has-text('Next Step')",
  resetBtn: "button:has-text('Reset')",
  darkModeToggle: 'button[title="Toggle dark mode"]',
  localeLink: "a:has(svg.lucide-globe)",
  progressBar: ".h-3.rounded-full > div",
  lessonRow: (slug: string) => `button:has-text("#${slug.split("-")[0]}`,
  simulatorStep: (step: number) => `text=Step ${step}:`,
  completionMsg: "text=Simulation complete!",
  monacoEditor: ".monaco-editor",
};

export function buildAllRoutes(): string[] {
  const routes: string[] = [];
  for (const locale of LOCALES) {
    routes.push(`/${locale}`);
    routes.push(`/${locale}/timeline`);
    routes.push(`/${locale}/dashboard`);
    routes.push(`/${locale}/playground`);
    for (const slug of LESSON_SLUGS) {
      routes.push(`/${locale}/${slug}`);
    }
  }
  // root redirect
  routes.push("/");
  return routes;
}
