export interface ChannelNode {
  id: string;
  type: "platform" | "gateway" | "agent" | "model";
  label: string;
  icon: string;
  color: string;
}

export interface ChannelEdge {
  from: string;
  to: string;
  label?: string;
}

export const CHANNEL_NODES: ChannelNode[] = [
  { id: "telegram", type: "platform", label: "Telegram", icon: "\uD83D\uDCF1", color: "#229ED9" },
  { id: "discord", type: "platform", label: "Discord", icon: "\uD83D\uDCAC", color: "#5865F2" },
  { id: "slack", type: "platform", label: "Slack", icon: "\uD83D\uDCCB", color: "#4A154B" },
  { id: "webchat", type: "platform", label: "WebChat", icon: "\uD83C\uDF10", color: "#10B981" },
  { id: "gateway", type: "gateway", label: "Gateway", icon: "\uD83D\uDD00", color: "#3B82F6" },
  { id: "router", type: "gateway", label: "Router", icon: "\uD83D\uDE84", color: "#8B5CF6" },
  { id: "agent", type: "agent", label: "Agent", icon: "\uD83E\uDD16", color: "#F59E0B" },
  { id: "model", type: "model", label: "LLM", icon: "\uD83E\uDDE0", color: "#EF4444" },
];

export const SINGLE_CHANNEL_EDGES: ChannelEdge[] = [
  { from: "telegram", to: "gateway", label: "message" },
  { from: "gateway", to: "router", label: "route" },
  { from: "router", to: "agent", label: "assign" },
  { from: "agent", to: "model", label: "prompt" },
  { from: "model", to: "agent", label: "response" },
  { from: "agent", to: "gateway", label: "reply" },
  { from: "gateway", to: "telegram", label: "deliver" },
];
