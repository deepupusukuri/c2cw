"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, Role } from "@c2cw/types";
import { api } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/auth/me");
      setUser(me);
    } catch {
      setUser(null);
      localStorage.removeItem("c2cw_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("c2cw_token")) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  async function setToken(token: string) {
    localStorage.setItem("c2cw_token", token);
    await fetchMe();
  }

  async function login(email: string, password: string) {
    const res = await api.post<{ accessToken: string; user: AuthUser }>("/auth/login", {
      email,
      password,
    });
    await setToken(res.accessToken);
  }

  async function register(email: string, password: string, name: string, role: Role) {
    const res = await api.post<{ accessToken: string; user: AuthUser }>("/auth/register", {
      email,
      password,
      name,
      role,
    });
    await setToken(res.accessToken);
  }

  function logout() {
    localStorage.removeItem("c2cw_token");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
