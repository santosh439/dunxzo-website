import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, setToken } from "../lib/api.js";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = checking
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = (() => { try { return localStorage.getItem("dunzo.platform.token"); } catch { return null; } })();
      if (!token) { setUser(false); setReady(true); return; }
      try {
        const { user } = await apiFetch("/auth/me");
        setUser(user);
      } catch {
        setUser(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { token, user } = await apiFetch("/auth/register", { method: "POST", body: { name, email, password } });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(false);
  }, []);

  const markOnboarded = useCallback(() => setUser((u) => (u ? { ...u, onboarded: true } : u)), []);

  return (
    <AuthCtx.Provider value={{ user, ready, login, register, logout, markOnboarded }}>
      {children}
    </AuthCtx.Provider>
  );
}
