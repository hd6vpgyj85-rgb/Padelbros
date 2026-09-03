import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface ProductStatsRow {
  product_id: string;
  views: number;
  cart_adds: number;
  purchases: number;
}

interface AnalyticsState {
  views: Record<string, number>;
  cartAdds: Record<string, number>;
  purchases: Record<string, number>;
}

const EMPTY_STATE: AnalyticsState = { views: {}, cartAdds: {}, purchases: {} };

interface AnalyticsContextValue extends AnalyticsState {
  trackView: (productId: string) => void;
  trackCartAdd: (productId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalyticsState>(EMPTY_STATE);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("product_stats")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("No se pudieron cargar las estadísticas de productos", error);
          return;
        }
        const next: AnalyticsState = { views: {}, cartAdds: {}, purchases: {} };
        (data as ProductStatsRow[]).forEach((row) => {
          next.views[row.product_id] = row.views;
          next.cartAdds[row.product_id] = row.cart_adds;
          next.purchases[row.product_id] = row.purchases;
        });
        setState(next);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const trackView = (productId: string) => {
    setState((current) => ({
      ...current,
      views: { ...current.views, [productId]: (current.views[productId] ?? 0) + 1 },
    }));
    supabase.rpc("increment_product_stat", { p_product_id: productId, p_field: "views" }).then(({ error }) => {
      if (error) console.error("No se pudo registrar la vista del producto", error);
    });
  };

  const trackCartAdd = (productId: string) => {
    setState((current) => ({
      ...current,
      cartAdds: { ...current.cartAdds, [productId]: (current.cartAdds[productId] ?? 0) + 1 },
    }));
    supabase.rpc("increment_product_stat", { p_product_id: productId, p_field: "cart_adds" }).then(({ error }) => {
      if (error) console.error("No se pudo registrar el agregado al carrito", error);
    });
  };

  const value: AnalyticsContextValue = { ...state, trackView, trackCartAdd };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error("useAnalytics must be used within an AnalyticsProvider");
  return context;
}
