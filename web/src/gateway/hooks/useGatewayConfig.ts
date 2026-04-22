"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GatewayConfigResponse } from "@/types/gateway";
import gatewayClient from "../client";

export function useGatewayConfig() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gatewayClient.request("config.get");
      const typed = response as unknown as GatewayConfigResponse;
      setConfig(typed.config);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch config";
      setError(message);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateConfig = useCallback(
    async (newConfig: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        await gatewayClient.request("config.update", {
          config: newConfig,
        });
        setConfig(newConfig);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update config";
        setError(message);
        throw err;
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    config,
    loading,
    error,
    fetchConfig,
    updateConfig,
  };
}
