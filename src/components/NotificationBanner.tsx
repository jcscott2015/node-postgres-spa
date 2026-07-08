import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export function NotificationBanner() {
  const { messages, status, error } = useSelector(
    (state: RootState) => state.websocket,
  );
  const latest = messages[0];

  return (
    <div className="banner" role="status">
      <div>
        <strong>Live events</strong>
        <span>{latest ?? "Waiting for websocket messages..."}</span>
      </div>
      <div className="row">
        <span className="status-pill">Socket {status}</span>
        {error ? <span className="error-text">{error}</span> : null}
      </div>
    </div>
  );
}
