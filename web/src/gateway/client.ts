import type { ConnectionState, GatewayMessage } from "@/types/gateway";

type EventHandler = (message: GatewayMessage) => void;

interface PendingRequest {
  resolve: (value: GatewayMessage) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface StateChangeHandler {
  (state: ConnectionState): void;
}

class GatewayClient {
  private static instance: GatewayClient | null = null;
  private ws: WebSocket | null = null;
  private url = "ws://127.0.0.1:18789/ws";
  private state: ConnectionState = "disconnected";
  private handlers = new Map<string, Set<EventHandler>>();
  private stateHandlers = new Set<StateChangeHandler>();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private readonly maxReconnectDelay = 30000;
  private pendingRequests = new Map<
    string,
    PendingRequest
  >();
  private requestId = 0;
  private requestTimeout = 10000;
  private disposed = false;

  private constructor() {}

  static getInstance(): GatewayClient {
    if (!GatewayClient.instance) {
      GatewayClient.instance = new GatewayClient();
    }
    return GatewayClient.instance;
  }

  getState(): ConnectionState {
    return this.state;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(url: string): void {
    this.url = url;
    if (this.state === "connected" || this.state === "connecting") {
      this.disconnect();
    }
  }

  connect(): void {
    if (
      this.state === "connected" ||
      this.state === "connecting"
    ) {
      return;
    }

    this.disposed = false;
    this.setState("connecting");

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this.setState("error");
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectDelay = 1000;
      this.setState("connected");
      this.startHeartbeat();
      this.flushPendingRequests();
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.setState("disconnected");
      if (!this.disposed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      // The onclose handler will fire after onerror, so we
      // handle state transition there. We still reject any
      // pending requests immediately.
      this.rejectAllPending("Connection error");
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: GatewayMessage = JSON.parse(event.data as string);
        this.handleMessage(message);
      } catch {
        // Ignore malformed messages
      }
    };
  }

  disconnect(): void {
    this.disposed = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.rejectAllPending("Disconnected");

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;
      this.ws.close();
      this.ws = null;
    }

    this.setState("disconnected");
  }

  send(type: string, data?: Record<string, unknown>): void {
    const message: GatewayMessage = {
      type,
      timestamp: Date.now(),
      ...data,
    };
    this.sendRaw(message);
  }

  request(
    type: string,
    data?: Record<string, unknown>,
    timeout?: number
  ): Promise<GatewayMessage> {
    return new Promise<GatewayMessage>((resolve, reject) => {
      const id = `req_${++this.requestId}_${Date.now()}`;
      const ms = timeout ?? this.requestTimeout;

      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request "${type}" timed out after ${ms}ms`));
      }, ms);

      this.pendingRequests.set(id, { resolve, reject, timer });

      const message: GatewayMessage = {
        type,
        id,
        timestamp: Date.now(),
        ...data,
      };

      this.sendRaw(message);
    });
  }

  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  onStateChange(handler: StateChangeHandler): () => void {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }

  emit(event: string, message: GatewayMessage): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(message);
      } catch {
        // Prevent handler errors from disrupting the emitter
      }
    });
  }

  private sendRaw(message: GatewayMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else if (this.ws?.readyState === WebSocket.CONNECTING) {
      // Queue the message to be sent once the connection opens.
      // We store it in pendingRequests under a special "queue" key.
      // If the connection fails, flushPendingRequests will not resolve
      // these, but rejectAllPending will clean them up. A simpler
      // approach: retry after a short delay.
      setTimeout(() => this.sendRaw(message), 100);
    }
    // If neither OPEN nor CONNECTING, the message is silently dropped.
  }

  private handleMessage(message: GatewayMessage): void {
    // Check if this is a response to a pending request
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      clearTimeout(pending.timer);
      this.pendingRequests.delete(message.id);
      pending.resolve(message);
      return;
    }

    // Emit to any registered handlers for this message type
    this.emit(message.type, message);

    // Also emit to wildcard handlers
    this.emit("*", message);
  }

  private setState(state: ConnectionState): void {
    if (this.state === state) return;
    this.state = state;
    this.stateHandlers.forEach((handler) => {
      try {
        handler(state);
      } catch {
        // Prevent handler errors from disrupting state propagation
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send("ping");
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    if (this.disposed) return;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff: 1s -> 2s -> 4s -> 8s -> 16s -> 30s (capped)
    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      this.maxReconnectDelay
    );
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private rejectAllPending(reason: string): void {
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timer);
      pending.reject(new Error(reason));
    }
    this.pendingRequests.clear();
  }

  private flushPendingRequests(): void {
    // No-op: pending requests are sent via sendRaw which retries
    // automatically when the socket transitions to CONNECTING.
    // They will go through now that we are OPEN.
  }
}

export const gatewayClient = GatewayClient.getInstance();
export { GatewayClient };
export default gatewayClient;
