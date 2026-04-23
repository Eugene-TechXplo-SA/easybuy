"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_profiles")
      .select("first_name")
      .eq("id", userId)
      .maybeSingle() as { data: { first_name: string } | null; error: unknown };
    setFirstName(data ? (data.first_name || null) : null);
  };

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => { await fetchProfile(session.user.id); })();
      } else {
        setFirstName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
