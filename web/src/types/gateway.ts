export type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

export interface GatewayMessage {
  type: string;
  id?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface GatewayConfigResponse {
  type: "config";
  config: Record<string, unknown>;
}

export interface GatewayChatMessage {
  type: "chat";
  sessionId?: string;
  message: string;
  role: "user" | "assistant";
}

export interface GatewayChatResponse {
  type: "chat_response";
  sessionId: string;
  message: string;
  role: "assistant";
  timestamp: number;
}

export interface GatewaySkillListResponse {
  type: "skill_list";
  skills: Array<{
    name: string;
    version: string;
    description: string;
    enabled: boolean;
  }>;
}

export interface GatewayChannelListResponse {
  type: "channel_list";
  channels: Array<{
    id: string;
    type: string;
    name: string;
    status: "active" | "inactive" | "error";
  }>;
}
