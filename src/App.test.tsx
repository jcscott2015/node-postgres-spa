import { describe, expect, it, vi } from "vitest";
import { createSocketConnection } from "@/app/websocketClient";

const WebSocketMock = class {
  static instances: Array<{ url: string; protocols?: string[] }> = [];

  constructor(
    public url: string,
    public protocols?: string | string[],
  ) {
    WebSocketMock.instances.push({
      url,
      protocols: Array.isArray(protocols)
        ? protocols
        : protocols
          ? [protocols]
          : undefined,
    });
  }

  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
};

vi.stubGlobal("WebSocket", WebSocketMock as unknown as typeof WebSocket);

describe("App websocket connection", () => {
  it("opens a websocket using cookie auth", () => {
    const socket = createSocketConnection("localhost", "ws");

    expect(WebSocketMock.instances).toHaveLength(1);
    expect(WebSocketMock.instances[0]?.url).toBe("ws://localhost/ws");
    expect(WebSocketMock.instances[0]?.protocols).toBeUndefined();
    expect(socket).toBeInstanceOf(WebSocket);
  });
});
