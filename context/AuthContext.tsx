import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from "../lib/supabase";
import { AppUser } from "../types";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    storeName?: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  updateStoreName: (name: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setSession(session);
      if (session) {
        setLoading(true);
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUser(userId: string, attempt = 1): Promise<void> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setUser(data as AppUser);
      setLoading(false);
      return;
    }

    // DB trigger may not have fired yet — retry up to 3 times
    if (attempt < 3) {
      setTimeout(() => fetchUser(userId, attempt + 1), 1000);
      return;
    }

    console.error("fetchUser error:", error?.message, "userId:", userId);
    setLoading(false);
  }

  async function signIn(
    email: string,
    password: string,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message ?? null };
  }

  async function signUp(
    email: string,
    password: string,
    storeName?: string,
  ): Promise<{ error: string | null }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user && storeName) {
      await supabase
        .from("users")
        .update({ store_name: storeName })
        .eq("id", data.user.id);
    }

    return { error: null };
  }

  async function updateStoreName(name: string): Promise<{ error: string | null }> {
    if (!session) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('users')
      .update({ store_name: name })
      .eq('id', session.user.id);
    if (error) return { error: error.message };
    await fetchUser(session.user.id);
    return { error: null };
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async function signInWithGoogle(): Promise<{ error: string | null }> {
    const redirectUrl = makeRedirectUri({ scheme: 'tally' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      return { error: error?.message ?? 'Could not start Google sign-in' };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === 'success' && result.url) {
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(result.url);
      if (sessionError) return { error: sessionError.message };
    } else if (result.type === 'cancel') {
      return { error: 'Sign-in was cancelled' };
    }

    return { error: null };
  }

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signIn, signUp, signOut, signInWithGoogle, updateStoreName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
