"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  id: string;
  email: string | undefined;
}

interface AuthContextValue {
  user: AuthUser | null;
  firstName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  firstName: null,
  loading: true,
  signOut: async () => {},
});

async function fetchUser(): Promise<{ user: AuthUser | null; firstName: string | null }> {
  try {
    const res = await fetch("/api/auth/user");
    if (!res.ok) return { user: null, firstName: null };
    const data = await res.json();
    if (!data.user) return { user: null, firstName: null };
    const firstName = data.user.firstName ?? data.user.fullName?.split(" ")[0] ?? null;
    return { user: { id: data.user.id, email: data.user.email }, firstName };
  } catch {
    return { user: null, firstName: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(({ user, firstName }) => {
      setUser(user);
      setFirstName(firstName);
      setLoading(false);
    });
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ user, firstName, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
