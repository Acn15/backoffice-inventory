"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/domains/auth/domain/entities/auth-user";
import { authContainer } from "@/domains/auth/infrastructure/auth.container";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const restored = await authContainer.restoreSessionUseCase.execute();
      if (!active) {
        return;
      }

      if (restored) {
        setUser(restored);
        setStatus("authenticated");
        return;
      }

      setUser(null);
      setStatus("unauthenticated");
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextUser = await authContainer.loginUseCase.execute({
      email,
      password,
    });
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      await authContainer.logoutUseCase.execute();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const sessionUser = await authContainer.authRepository.getSession();
    if (!sessionUser) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setUser(sessionUser);
    setStatus("authenticated");
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      login,
      logout,
      refreshProfile,
    }),
    [status, user, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
