"use client";

import { useCallback, useRef, useState } from "react";
import type { GatewaySkillListResponse } from "@/types/gateway";
import gatewayClient from "../client";

interface Skill {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
}

export function useGatewaySkill() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gatewayClient.request("skill.list");
      const typed = response as unknown as GatewaySkillListResponse;
      setSkills(typed.skills);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch skills";
      setError(message);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const installSkill = useCallback(async (skillName: string) => {
    setLoading(true);
    setError(null);
    try {
      await gatewayClient.request("skill.install", { name: skillName });
      // Re-fetch the skill list to reflect the new installation
      const response = await gatewayClient.request("skill.list");
      const typed = response as unknown as GatewaySkillListResponse;
      setSkills(typed.skills);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to install skill";
      setError(message);
      throw err;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const toggleSkill = useCallback(async (skillName: string, enabled: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await gatewayClient.request("skill.toggle", {
        name: skillName,
        enabled,
      });
      // Optimistically update the local state
      setSkills((prev) =>
        prev.map((s) => (s.name === skillName ? { ...s, enabled } : s))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle skill";
      setError(message);
      throw err;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Mount tracking
  useState(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  return {
    skills,
    loading,
    error,
    fetchSkills,
    installSkill,
    toggleSkill,
  };
}
