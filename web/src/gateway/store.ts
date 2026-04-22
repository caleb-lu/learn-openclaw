import { create } from "zustand";
import type { ConnectionState } from "@/types/gateway";
import gatewayClient from "./client";

interface GatewayStore {
  connectionState: ConnectionState;
  gatewayUrl: string;
  lastError: string | null;
  connect: () => void;
  disconnect: () => void;
  setUrl: (url: string) => void;
}

export const useGatewayStore = create<GatewayStore>((set, get) => {
  // Subscribe to the singleton client's state changes
  gatewayClient.onStateChange((state: ConnectionState) => {
    set({
      connectionState: state,
      lastError: state === "error" ? "Connection failed" : null,
    });
  });

  return {
    connectionState: gatewayClient.getState(),
    gatewayUrl: gatewayClient.getUrl(),
    lastError: null,

    connect() {
      const { gatewayUrl } = get();
      gatewayClient.setUrl(gatewayUrl);
      gatewayClient.connect();
    },

    disconnect() {
      gatewayClient.disconnect();
    },

    setUrl(url: string) {
      gatewayClient.setUrl(url);
      set({ gatewayUrl: url });
    },
  };
});
