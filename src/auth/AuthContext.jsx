import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (auth?.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth]);

  async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    const data = res.data;

    const payload = {
      token: data.accessToken || data.token || data.jwt || data.access_token,
      id: data.user?.id ?? data.id,
      username: data.user?.username ?? data.username,
      role: data.user?.role ?? data.role,
    };

    setAuth(payload);
    localStorage.setItem("auth", JSON.stringify(payload));
    return payload; // so Login page can navigate by real role
  }

  // 🔹 NEW: register (non-breaking). Tries common endpoints and returns server data.
  async function register(payload) {
    const attempts = [
      () => api.post("/auth/register", payload),
      () => api.post("/register", payload),
      () => api.post("/users/register", payload),
      () => api.post("/api/v1/auth/register", payload),
    ];
    let lastErr;
    for (const attempt of attempts) {
      try {
        const { data } = await attempt();
        return data; // do NOT set auth here; your flow shows a success then redirects to /login
      } catch (e) {
        const status = e?.response?.status;
        // if route doesn't exist / not allowed, try next
        if ([404, 405, 501].includes(status)) { lastErr = e; continue; }
        throw e; // surface validation or other errors to the UI
      }
    }
    throw lastErr || new Error("No register endpoint found");
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("auth");
    delete api.defaults.headers.common["Authorization"];
  }

  const value = {
    ...auth,
    isAuthed: !!auth?.token,
    role: auth?.role,
    login,
    logout,
    register, // 🔹 expose register to the app
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
