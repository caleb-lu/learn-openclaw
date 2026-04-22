export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const LESSON_ORDER = [
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

export type LessonSlug = (typeof LESSON_ORDER)[number];

export interface Week {
  number: number;
  slug: string;
  title: Record<Locale, string>;
  color: string;
  lessons: LessonSlug[];
}

export const WEEKS: Week[] = [
  {
    number: 1,
    slug: "deployment-configuration",
    title: { en: "Deployment & Configuration", zh: "部署与配置" },
    color: "#3B82F6",
    lessons: LESSON_ORDER.slice(0, 4) as unknown as LessonSlug[],
  },
  {
    number: 2,
    slug: "channels-routing",
    title: { en: "Channels & Routing", zh: "渠道与路由" },
    color: "#10B981",
    lessons: LESSON_ORDER.slice(4, 8) as unknown as LessonSlug[],
  },
  {
    number: 3,
    slug: "intelligence-memory",
    title: { en: "Intelligence & Memory", zh: "智能与记忆" },
    color: "#8B5CF6",
    lessons: LESSON_ORDER.slice(8, 12) as unknown as LessonSlug[],
  },
  {
    number: 4,
    slug: "automation-advanced",
    title: { en: "Automation & Advanced", zh: "自动化与进阶" },
    color: "#F59E0B",
    lessons: LESSON_ORDER.slice(12) as unknown as LessonSlug[],
  },
];

export interface LessonMeta {
  slug: LessonSlug;
  number: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  week: number;
  duration: number;
  hasConfigEditor: boolean;
  hasChannelFlow: boolean;
  hasSoulWorkshop: boolean;
  hasSkillPlayground: boolean;
  hasPromptStack: boolean;
  hasMemoryDemo: boolean;
  hasCanvasPreview: boolean;
  hasAutomation: boolean;
  hasVisualization: boolean;
}

export const LESSON_META: Record<LessonSlug, LessonMeta> = {
  "01-installation": {
    slug: "01-installation",
    number: 1,
    title: { en: "Installation & Deployment", zh: "安装部署" },
    description: { en: "Install OpenClaw via Docker or npm, start the Gateway daemon, and verify your CLI.", zh: "通过 Docker 或 npm 安装 OpenClaw，启动 Gateway 守护进程，验证 CLI。" },
    week: 1,
    duration: 45,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "02-configuration": {
    slug: "02-configuration",
    number: 2,
    title: { en: "Configuration Deep Dive", zh: "配置详解" },
    description: { en: "Master openclaw.json, JSON5 syntax, and all configuration parameters.", zh: "掌握 openclaw.json、JSON5 语法及全部配置参数。" },
    week: 1,
    duration: 60,
    hasConfigEditor: true, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "03-workspace": {
    slug: "03-workspace",
    number: 3,
    title: { en: "Workspace & Personality", zh: "工作空间" },
    description: { en: "Define your AI's personality with SOUL.md, IDENTITY.md, and TOOLS.md.", zh: "通过 SOUL.md、IDENTITY.md 和 TOOLS.md 定义 AI 人格。" },
    week: 1,
    duration: 50,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: true,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "04-first-conversation": {
    slug: "04-first-conversation",
    number: 4,
    title: { en: "Your First Conversation", zh: "初次对话" },
    description: { en: "Chat via CLI and WebChat, create sessions, and understand the conversation flow.", zh: "通过 CLI 和 WebChat 聊天，创建会话，理解对话流程。" },
    week: 1,
    duration: 35,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "05-channel-setup": {
    slug: "05-channel-setup",
    number: 5,
    title: { en: "Channel Setup", zh: "渠道接入" },
    description: { en: "Connect Telegram bot, Discord webhook, and Slack app channels.", zh: "接入 Telegram bot、Discord webhook 和 Slack app 渠道。" },
    week: 2,
    duration: 55,
    hasConfigEditor: false, hasChannelFlow: true, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "06-multi-channel": {
    slug: "06-multi-channel",
    number: 6,
    title: { en: "Multi-Channel Coordination", zh: "多渠道协同" },
    description: { en: "Run 25+ channels in parallel and coordinate across platforms.", zh: "并行运行 25+ 渠道，跨平台协调。" },
    week: 2,
    duration: 50,
    hasConfigEditor: false, hasChannelFlow: true, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "07-routing-rules": {
    slug: "07-routing-rules",
    number: 7,
    title: { en: "Routing Rules", zh: "路由规则" },
    description: { en: "Master the 5-layer binding table and pattern matching for intelligent routing.", zh: "掌握 5 层绑定表和模式匹配的智能路由。" },
    week: 2,
    duration: 60,
    hasConfigEditor: false, hasChannelFlow: true, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "08-multi-agent": {
    slug: "08-multi-agent",
    number: 8,
    title: { en: "Multi-Agent Setup", zh: "多 Agent" },
    description: { en: "Configure multiple agents for work, life, and coding assistants.", zh: "配置多 Agent 用于工作、生活和编程助手。" },
    week: 2,
    duration: 55,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "09-prompt-engineering": {
    slug: "09-prompt-engineering",
    number: 9,
    title: { en: "Prompt Engineering", zh: "Prompt 工程" },
    description: { en: "Understand the 8-layer prompt stack and how each layer influences responses.", zh: "理解 8 层 Prompt 堆叠及各层对响应的影响。" },
    week: 3,
    duration: 65,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: true, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "10-memory-system": {
    slug: "10-memory-system",
    number: 10,
    title: { en: "Memory System", zh: "记忆系统" },
    description: { en: "MEMORY.md, daily memory snapshots, and automatic recall mechanisms.", zh: "MEMORY.md、每日记忆快照和自动召回机制。" },
    week: 3,
    duration: 55,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: true,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "11-skill-installation": {
    slug: "11-skill-installation",
    number: 11,
    title: { en: "Skill Installation", zh: "技能安装" },
    description: { en: "Browse ClawHub, install skills, and understand the SKILL.md format.", zh: "浏览 ClawHub、安装技能、理解 SKILL.md 格式。" },
    week: 3,
    duration: 50,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: true, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "12-custom-skills": {
    slug: "12-custom-skills",
    number: 12,
    title: { en: "Custom Skills", zh: "自定义技能" },
    description: { en: "Write your own SKILL.md with YAML frontmatter and custom logic.", zh: "编写自定义 SKILL.md，包含 YAML frontmatter 和自定义逻辑。" },
    week: 3,
    duration: 65,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: true, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "13-scheduled-tasks": {
    slug: "13-scheduled-tasks",
    number: 13,
    title: { en: "Scheduled Tasks", zh: "定时任务" },
    description: { en: "at/every/cron syntax, scheduling, and task execution.", zh: "at/every/cron 语法、调度和任务执行。" },
    week: 4,
    duration: 50,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: true, hasVisualization: true,
  },
  "14-webhooks": {
    slug: "14-webhooks",
    number: 14,
    title: { en: "Webhooks", zh: "Webhook" },
    description: { en: "HTTP triggers, event-driven automation, and webhook workflows.", zh: "HTTP 触发器、事件驱动自动化和 Webhook 工作流。" },
    week: 4,
    duration: 50,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: true, hasVisualization: true,
  },
  "15-canvas-a2ui": {
    slug: "15-canvas-a2ui",
    number: 15,
    title: { en: "Canvas & A2UI", zh: "Canvas & A2UI" },
    description: { en: "Agent-to-UI rendering, visual content pushing, and Canvas components.", zh: "Agent 推送可视化内容、Canvas 组件。" },
    week: 4,
    duration: 55,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: true, hasAutomation: false, hasVisualization: true,
  },
  "16-voice-nodes": {
    slug: "16-voice-nodes",
    number: 16,
    title: { en: "Voice & Nodes", zh: "语音与节点" },
    description: { en: "Voice wake, mobile device nodes, and distributed deployment.", zh: "语音唤醒、移动设备节点和分布式部署。" },
    week: 4,
    duration: 40,
    hasConfigEditor: false, hasChannelFlow: false, hasSoulWorkshop: false,
    hasSkillPlayground: false, hasPromptStack: false, hasMemoryDemo: false,
    hasCanvasPreview: false, hasAutomation: false, hasVisualization: true,
  },
  "17-capstone": {
    slug: "17-capstone",
    number: 17,
    title: { en: "Capstone: Your 24/7 AI Assistant", zh: "Capstone: 24/7 AI 助手" },
    description: { en: "Build a complete 24/7 personal AI assistant combining all learned concepts.", zh: "构建完整的 24/7 个人 AI 助手，综合运用所学。" },
    week: 4,
    duration: 90,
    hasConfigEditor: true, hasChannelFlow: true, hasSoulWorkshop: true,
    hasSkillPlayground: true, hasPromptStack: true, hasMemoryDemo: true,
    hasCanvasPreview: true, hasAutomation: true, hasVisualization: true,
  },
};

export function getLessonMeta(slug: string): LessonMeta | undefined {
  return LESSON_META[slug as LessonSlug];
}

export function getWeekForLesson(slug: LessonSlug): Week {
  const meta = LESSON_META[slug];
  return WEEKS[meta.week - 1];
}

export function getAdjacentLessons(slug: LessonSlug): { prev?: LessonSlug; next?: LessonSlug } {
  const idx = LESSON_ORDER.indexOf(slug);
  return {
    prev: idx > 0 ? LESSON_ORDER[idx - 1] : undefined,
    next: idx < LESSON_ORDER.length - 1 ? LESSON_ORDER[idx + 1] : undefined,
  };
}
