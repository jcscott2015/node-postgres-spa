import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { setAuth, setAuthError } from "@/app/authSlice";

export function CallbackPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      dispatch(setAuthError("Missing authorization code."));
      navigate("/login", { replace: true });
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const response = await fetch("/oauth/callback", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange code for token.");
        }

        dispatch(setAuth({ username: "oauth-user" }));
        navigate("/users", { replace: true });
      } catch (err) {
        dispatch(
          setAuthError(
            err instanceof Error ? err.message : "OAuth callback failed.",
          ),
        );
        navigate("/login", { replace: true });
      }
    };

    void exchangeCodeForToken();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "1rem" }}>Completing sign in…</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
