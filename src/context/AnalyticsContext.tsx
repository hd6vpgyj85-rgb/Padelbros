import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "padelbros_analytics";

interface AnalyticsState {
  views: Record<string, number>;
  cartAdds: Record<string, number>;
}

function isCountMap(value: unknown): value is Record<string, number> {
  return Boolean(value) && typeof value === "object";
}

function readAnalytics(): AnalyticsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { views: {}, cartAdds: {} };
    const parsed = JSON.parse(raw);
    return {
      views: isCountMap(parsed?.views) ? parsed.views : {},
      cartAdds: isCountMap(parsed?.cartAdds) ? parsed.cartAdds : {},
    };
  } catch {
    return { views: {}, cartAdds: {} };
  }
}

interface AnalyticsContextValue {
  views: Record<string, number>;
  cartAdds: Record<string, number>;
  trackView: (productId: string) => void;
  trackCartAdd: (productId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalyticsState>(() => readAnalytics());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable — counters just won't persist.
    }
  }, [state]);

  const trackView = (productId: string) => {
    setState((current) => ({
      ...current,
      views: { ...current.views, [productId]: (current.views[productId] ?? 0) + 1 },
    }));
  };

  const trackCartAdd = (productId: string) => {
    setState((current) => ({
      ...current,
      cartAdds: { ...current.cartAdds, [productId]: (current.cartAdds[productId] ?? 0) + 1 },
    }));
  };

  const value: AnalyticsContextValue = { ...state, trackView, trackCartAdd };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error("useAnalytics must be used within an AnalyticsProvider");
  return context;
}
