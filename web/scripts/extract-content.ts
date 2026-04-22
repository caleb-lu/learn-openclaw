import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../..");
const LESSONS_DIR = path.join(ROOT, "lessons");
const SAMPLES_DIR = path.join(ROOT, "samples");
const OUTPUT_DIR = path.join(__dirname, "../src/data/generated");

interface ExtractedLesson {
  slug: string;
  locale: string;
  title: string;
  description: string;
  content: string;
  objectives: string[];
  prerequisites: string[];
  duration: number;
  week: number;
}

const LESSON_ORDER = [
  "01-installation", "02-configuration", "03-workspace", "04-first-conversation",
  "05-channel-setup", "06-multi-channel", "07-routing-rules", "08-multi-agent",
  "09-prompt-engineering", "10-memory-system", "11-skill-installation", "12-custom-skills",
  "13-scheduled-tasks", "14-webhooks", "15-canvas-a2ui", "16-voice-nodes", "17-capstone",
];

const LESSON_DURATION: Record<string, number> = {
  "01-installation": 45, "02-configuration": 60, "03-workspace": 50, "04-first-conversation": 35,
  "05-channel-setup": 55, "06-multi-channel": 50, "07-routing-rules": 60, "08-multi-agent": 55,
  "09-prompt-engineering": 65, "10-memory-system": 55, "11-skill-installation": 50, "12-custom-skills": 65,
  "13-scheduled-tasks": 50, "14-webhooks": 50, "15-canvas-a2ui": 55, "16-voice-nodes": 40, "17-capstone": 90,
};

const WEEK_MAP: Record<string, number> = {};
["01-installation", "02-configuration", "03-workspace", "04-first-conversation"].forEach(s => WEEK_MAP[s] = 1);
["05-channel-setup", "06-multi-channel", "07-routing-rules", "08-multi-agent"].forEach(s => WEEK_MAP[s] = 2);
["09-prompt-engineering", "10-memory-system", "11-skill-installation", "12-custom-skills"].forEach(s => WEEK_MAP[s] = 3);
["13-scheduled-tasks", "14-webhooks", "15-canvas-a2ui", "16-voice-nodes", "17-capstone"].forEach(s => WEEK_MAP[s] = 4);

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(":").trim();
    }
  }
  return { meta, body: match[2] };
}

function extractSection(content: string, heading: string): string[] {
  const regex = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n([\\s\\S]*?)(?=^##\\s|$)`, "m");
  const match = content.match(regex);
  if (!match) return [];
  return match[1]
    .split("\n")
    .filter((line) => line.startsWith("- ") || line.startsWith("* "))
    .map((line) => line.replace(/^[-*]\s+/, ""))
    .filter(Boolean);
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function extractDescription(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-") && !trimmed.startsWith("```")) {
      return trimmed;
    }
  }
  return "";
}

function extractLesson(locale: string, slug: string): ExtractedLesson {
  const filePath = path.join(LESSONS_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return {
      slug, locale,
      title: slug,
      description: "",
      content: `# ${slug}\n\nContent not yet available.`,
      objectives: [],
      prerequisites: [],
      duration: LESSON_DURATION[slug] ?? 30,
      week: WEEK_MAP[slug] ?? 1,
    };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { body } = parseFrontmatter(raw);
  const title = extractTitle(body) || slug;
  const description = extractDescription(body);

  const objectivesKey = locale === "zh" ? "学习目标" : "Learning Objectives";
  const prereqKey = locale === "zh" ? "前置知识" : "Prerequisites";

  return {
    slug,
    locale,
    title,
    description,
    content: body,
    objectives: extractSection(body, objectivesKey),
    prerequisites: extractSection(body, prereqKey),
    duration: LESSON_DURATION[slug] ?? 30,
    week: WEEK_MAP[slug] ?? 1,
  };
}

function extractTemplates() {
  const configsDir = path.join(SAMPLES_DIR, "openclaw-configs");
  const workspacesDir = path.join(SAMPLES_DIR, "workspace-templates");
  const skillsDir = path.join(SAMPLES_DIR, "skills");

  const configs: Record<string, { filename: string; content: string; description: string }> = {};
  if (fs.existsSync(configsDir)) {
    for (const file of fs.readdirSync(configsDir)) {
      if (file.endsWith(".json5")) {
        const content = fs.readFileSync(path.join(configsDir, file), "utf-8");
        const name = file.replace(".json5", "");
        configs[name] = { filename: file, content, description: `${name} configuration` };
      }
    }
  }

  const workspaces: Record<string, Record<string, { filename: string; content: string; description: string }>> = {};
  if (fs.existsSync(workspacesDir)) {
    for (const dir of fs.readdirSync(workspacesDir)) {
      const dirPath = path.join(workspacesDir, dir);
      if (fs.statSync(dirPath).isDirectory()) {
        workspaces[dir] = {};
        for (const file of fs.readdirSync(dirPath)) {
          if (file.endsWith(".md")) {
            const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
            workspaces[dir][file] = { filename: file, content, description: `${dir}/${file}` };
          }
        }
      }
    }
  }

  const skills: Record<string, { name: string; content: string; description: string }> = {};
  if (fs.existsSync(skillsDir)) {
    for (const dir of fs.readdirSync(skillsDir)) {
      const skillFile = path.join(skillsDir, dir, "SKILL.md");
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, "utf-8");
        skills[dir] = { name: dir, content, description: `${dir} skill` };
      }
    }
  }

  return { configs, workspaces, skills };
}

function main() {
  console.log("Extracting content...");

  const lessons: Record<string, Record<string, ExtractedLesson>> = { en: {}, zh: {} };

  for (const locale of ["en", "zh"]) {
    for (const slug of LESSON_ORDER) {
      lessons[locale][slug] = extractLesson(locale, slug);
    }
  }

  const templates = extractTemplates();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "lessons.json"),
    JSON.stringify({ lessons, generatedAt: new Date().toISOString() }, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "templates.json"),
    JSON.stringify(templates, null, 2)
  );

  console.log(`Extracted ${LESSON_ORDER.length * 2} lessons and templates.`);
  console.log("Output:", OUTPUT_DIR);
}

main();
