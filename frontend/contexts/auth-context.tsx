"use client";

import * as React from "react";
import {
  loginRequest,
  logoutRequest,
  refreshSession,
  type AuthUser,
  type LoginCredentials,
} from "@/lib/auth-api";

// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Attempt silent restore from refresh-token cookie on first mount
  React.useEffect(() => {
    refreshSession()
      .then((restored) => setUser(restored))
      .finally(() => setIsLoading(false));
  }, []);

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    const data = await loginRequest(credentials);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = React.useCallback(async () => {
    await logoutRequest().catch(() => {
      // Best effort — clear local state regardless
    });
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
