import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    portal: "EMPLOYEE",
  });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const session = await login(form.username.trim(), form.password);
      if (session.role !== form.portal) {
        setError(
          `You are '${session.role}', but selected '${form.portal}' portal. Choose the correct portal to continue.`
        );
        return;
      }
      nav(session.role === "ADMIN" ? "/admin" : "/me", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign in</h2>
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={onSubmit} className="login-form">
          <label className="login-label">
            Username
            <input
              className="login-input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g. admin"
              autoFocus
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </label>

          <fieldset className="login-fieldset">
            <legend className="login-legend">Choose portal</legend>
            <label className="login-radio">
              <input
                type="radio"
                name="portal"
                value="EMPLOYEE"
                checked={form.portal === "EMPLOYEE"}
                onChange={(e) => setForm({ ...form, portal: e.target.value })}
              />
              Employee
            </label>
            <label className="login-radio">
              <input
                type="radio"
                name="portal"
                value="ADMIN"
                checked={form.portal === "ADMIN"}
                onChange={(e) => setForm({ ...form, portal: e.target.value })}
              />
              Admin
            </label>
          </fieldset>

          <button type="submit" className="login-button">Log in</button>
        </form>
      </div>
    </div>
  );
}
