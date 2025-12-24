'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type User = {
  id: string | number;
  email?: string;
  name?: string;
  role?: string;
};

export type Customer = {
  id: string | number;
  lead_id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
};

/**
 * Keep Supabase-like error shape because your UI expects error.message
 */
type AuthResult = {
  error: { message: string } | null;
};

export type AuthContextValue = {
  user: User | null;
  customer: Customer | null;
  loading: boolean;

  signIn: (email: string, password: string) => Promise<AuthResult>;

  // IMPORTANT: matches portal/signup usage: signUp(email, password, name, phone)
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<AuthResult>;

  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  customer: null,
  loading: false,
  signIn: async () => ({ error: { message: 'Auth is not configured yet' } }),
  signUp: async () => ({ error: { message: 'Auth is not configured yet' } }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Stub: no real auth wired yet
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (_email: string, _password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      setUser(null);
      setCustomer(null);
      return {
        error: { message: 'Login is temporarily disabled while authentication is being migrated.' },
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    _email: string,
    _password: string,
    _name?: string,
    _phone?: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      setUser(null);
      setCustomer(null);
      return {
        error: { message: 'Sign up is temporarily disabled while authentication is being migrated.' },
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setCustomer(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, customer, loading, signIn, signUp, signOut }),
    [user, customer, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
