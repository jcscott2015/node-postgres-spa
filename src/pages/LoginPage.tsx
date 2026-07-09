import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useLoginMutation } from "@/app/api";
import { setAuth, setAuthError } from "@/app/authSlice";
import type { RootState } from "@/app/store";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector((state: RootState) => state.auth.status);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/users", { replace: true });
    }
  }, [navigate, status]);

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(setAuthError(null));
    try {
      await login(values).unwrap();
      dispatch(setAuth({ username: values.username }));
      navigate("/users", { replace: true });
    } catch {
      dispatch(setAuthError("Unable to sign in."));
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h2>Sign in</h2>
      <p className="helper">
        Use your OAuth credentials to access protected users.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-grid"
        style={{ marginTop: "1rem" }}
      >
        <label className="field">
          <span>Username</span>
          <input autoComplete="username" {...register("username")} />
          {errors.username ? (
            <span className="error-text">{errors.username.message}</span>
          ) : null}
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <span className="error-text">{errors.password.message}</span>
          ) : null}
        </label>
        {error ? <div className="error-text">Unable to sign in.</div> : null}
        <button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
