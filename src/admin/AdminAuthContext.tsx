import { createContext, useContext, useState, type ReactNode } from "react";

const SESSION_KEY = "padelbros_admin_session";
const ADMIN_PASSWORD = "padelbros2024";

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readSession());

  const login = (password: string): boolean => {
    if (password !== ADMIN_PASSWORD) return false;
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Storage unavailable — the session simply won't persist across reloads.
    }
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage unavailable — nothing to clear.
    }
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return context;
}
