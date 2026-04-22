"use client";
import { useState } from "react";
import { SkillEditor } from "./editor";
import { SkillTester } from "./tester";

export function SkillPlayground() {
  const [skillContent, setSkillContent] = useState("");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SkillEditor onChange={setSkillContent} />
      <SkillTester skillContent={skillContent} />
    </div>
  );
}
