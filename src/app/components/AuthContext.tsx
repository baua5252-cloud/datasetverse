"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  authTab: "login" | "register";
  setAuthTab: (tab: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem("dv_token");
    if (saved) {
      setToken(saved);
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
          else {
            localStorage.removeItem("dv_token");
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("dv_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Auto-seed database on first load
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Login failed" };
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("dv_token", data.token);
    setShowAuth(false);
    return {};
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || "Registration failed" };
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("dv_token", data.token);
      setShowAuth(false);
      return {};
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("dv_token");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        showAuth,
        setShowAuth,
        authTab,
        setAuthTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
