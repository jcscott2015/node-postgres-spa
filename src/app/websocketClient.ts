export const createSocketConnection = (
  token: string,
  host: string,
  protocol: "ws" | "wss",
): WebSocket => {
  const wsUrl = `${protocol}://${host}/ws`;

  const subprotocols = ["access_token", token];

  return new WebSocket(wsUrl, subprotocols);
};
