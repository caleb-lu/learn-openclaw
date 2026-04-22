"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GatewayChatResponse } from "@/types/gateway";
import gatewayClient from "../client";
import type { GatewayMessage } from "@/types/gateway";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  timestamp: number;
}

export function useGatewayChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const unsubscribe = gatewayClient.on(
      "chat_response",
      (msg: GatewayMessage) => {
        const typed = msg as unknown as GatewayChatResponse;
        const chatMsg: ChatMessage = {
          id: `resp_${typed.timestamp}_${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          message: typed.message,
          timestamp: typed.timestamp,
        };
        setMessages((prev) => [...prev, chatMsg]);
        setLoading(false);
      }
    );

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, []);

  const send = useCallback((text: string, sessionId?: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      message: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    gatewayClient.send("chat", {
      message: text,
      role: "user",
      sessionId,
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    send,
    clearMessages,
    loading,
  };
}
