export const createSocketConnection = (
  host: string,
  protocol: "ws" | "wss",
): WebSocket => {
  const wsUrl = `${protocol}://${host}/ws`;

  return new WebSocket(wsUrl);
};
