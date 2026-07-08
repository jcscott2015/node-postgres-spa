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
  it("opens a websocket using the auth token subprotocol", () => {
    const socket = createSocketConnection("test-token", "localhost", "ws");

    expect(WebSocketMock.instances).toHaveLength(1);
    expect(WebSocketMock.instances[0]?.url).toBe("ws://localhost/ws");
    expect(WebSocketMock.instances[0]?.protocols).toEqual([
      "access_token",
      "test-token",
    ]);
    expect(socket).toBeInstanceOf(WebSocket);
  });
});
