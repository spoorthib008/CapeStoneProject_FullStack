// src/lib/api.js
import axios from "axios";

/**
 * Base URL rules:
 * - If VITE_API_BASE is set, we use it.
 *   -> It can be either "http://localhost:8080" or "http://localhost:8080/api/v1"
 *   -> We normalize to ensure it ends with "/api/v1"
 * - If not set, default to "http://localhost:8080/api/v1"
 */
function normalizeBase(input) {
  const raw = (input || "http://localhost:8080/api/v1").replace(/\/+$/, "");
  if (raw.endsWith("/api/v1")) return raw;
  return `${raw}/api/v1`;
}

const base = normalizeBase(import.meta.env.VITE_API_BASE);

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
});

// Attach freshest token (supports both {auth:{token}} and plain token)
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
        return config;
      }
    }
  } catch {
    // ignore JSON parse errors
  }
  const fallback = localStorage.getItem("token");
  if (fallback) config.headers.Authorization = `Bearer ${fallback}`;
  return config;
});

// Handle 401 → clear auth & redirect to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try { localStorage.removeItem("auth"); } catch {}
      try { localStorage.removeItem("token"); } catch {}
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
