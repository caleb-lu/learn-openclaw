"use client";

import { useCallback, useRef, useState } from "react";
import type { GatewayChannelListResponse } from "@/types/gateway";
import gatewayClient from "../client";

interface Channel {
  id: string;
  type: string;
  name: string;
  status: "active" | "inactive" | "error";
}

export function useGatewayChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gatewayClient.request("channel.list");
      const typed = response as unknown as GatewayChannelListResponse;
      setChannels(typed.channels);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch channels";
      setError(message);
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
    channels,
    loading,
    error,
    fetchChannels,
  };
}
