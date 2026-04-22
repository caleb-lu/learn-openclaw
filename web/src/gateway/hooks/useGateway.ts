"use client";

import { useEffect, useRef } from "react";
import { useGatewayStore } from "../store";

const STORAGE_KEY = "openclaw:gateway:was-connected";

export function useGateway() {
  const connectionState = useGatewayStore((s) => s.connectionState);
  const gatewayUrl = useGatewayStore((s) => s.gatewayUrl);
  const connect = useGatewayStore((s) => s.connect);
  const disconnect = useGatewayStore((s) => s.disconnect);
  const setUrl = useGatewayStore((s) => s.setUrl);

  const mounted = useRef(false);

  useEffect(() => {
    // Prevent double-mount in strict mode
    if (mounted.current) return;
    mounted.current = true;

    // Auto-connect if previously connected (persisted in sessionStorage)
    try {
      const wasConnected = sessionStorage.getItem(STORAGE_KEY);
      if (wasConnected === "true") {
        connect();
      }
    } catch {
      // sessionStorage may be unavailable
    }

    return () => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          connectionState === "connected" ? "true" : "false"
        );
      } catch {
        // Ignore write errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    connectionState,
    connect,
    disconnect,
    gatewayUrl,
    setGatewayUrl: setUrl,
  };
}
