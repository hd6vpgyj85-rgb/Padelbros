import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return "Correo o contraseña incorrectos.";
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AdminAuthContextValue = { isAuthenticated, isLoading, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return context;
}
