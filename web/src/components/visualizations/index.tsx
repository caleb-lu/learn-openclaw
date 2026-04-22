"use client";

import { LESSON_META, type LessonSlug } from "@/lib/constants";
import V01Installation from "./01-installation";
import V02Configuration from "./02-configuration";
import V03Workspace from "./03-workspace";
import V04FirstConversation from "./04-first-conversation";
import V05ChannelSetup from "./05-channel-setup";
import V06MultiChannel from "./06-multi-channel";
import V07RoutingRules from "./07-routing-rules";
import V08MultiAgent from "./08-multi-agent";
import V09PromptEngineering from "./09-prompt-engineering";
import V10MemorySystem from "./10-memory-system";
import V11SkillInstallation from "./11-skill-installation";
import V12CustomSkills from "./12-custom-skills";
import V13ScheduledTasks from "./13-scheduled-tasks";
import V14Webhooks from "./14-webhooks";
import V15CanvasA2UI from "./15-canvas-a2ui";
import V16VoiceNodes from "./16-voice-nodes";
import V17Capstone from "./17-capstone";

const components: Record<string, React.ComponentType> = {
  "01-installation": V01Installation,
  "02-configuration": V02Configuration,
  "03-workspace": V03Workspace,
  "04-first-conversation": V04FirstConversation,
  "05-channel-setup": V05ChannelSetup,
  "06-multi-channel": V06MultiChannel,
  "07-routing-rules": V07RoutingRules,
  "08-multi-agent": V08MultiAgent,
  "09-prompt-engineering": V09PromptEngineering,
  "10-memory-system": V10MemorySystem,
  "11-skill-installation": V11SkillInstallation,
  "12-custom-skills": V12CustomSkills,
  "13-scheduled-tasks": V13ScheduledTasks,
  "14-webhooks": V14Webhooks,
  "15-canvas-a2ui": V15CanvasA2UI,
  "16-voice-nodes": V16VoiceNodes,
  "17-capstone": V17Capstone,
};

export function LessonVisualization({ slug }: { slug: LessonSlug }) {
  const Component = components[slug];
  if (!Component) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <Microscope size={40} className="mx-auto mb-3 opacity-40" />
        <p>Visualization not yet available for this lesson.</p>
      </div>
    );
  }
  return <Component />;
}

function Microscope({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 3v2M12 13v2M3 9h2M19 9h2M5.6 5.6l1.4 1.4M17 11l1.4 1.4M5.6 12.4l1.4-1.4M17 7l1.4-1.4" />
      <path d="M8 16l-2 4M16 16l2 4M6 20h12" />
    </svg>
  );
}
