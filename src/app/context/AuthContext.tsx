"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loadCartFromDB, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) {
        dispatch(loadCartFromDB());
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        (async () => {
          dispatch(loadCartFromDB());
        })();
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    dispatch(removeAllItemsFromCart());
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
