import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
  createdAt: string;
}

export interface RedeemedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

interface CouponRow {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  usage_limit: number;
  times_used: number;
  active: boolean;
  created_at: string;
}

function rowToCoupon(row: CouponRow): Coupon {
  return {
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    usageLimit: row.usage_limit,
    timesUsed: row.times_used,
    active: row.active,
    createdAt: row.created_at,
  };
}

interface CouponsContextValue {
  coupons: Coupon[];
  isLoading: boolean;
  addCoupon: (coupon: { code: string; discountType: DiscountType; discountValue: number; usageLimit: number }) => Promise<void>;
  setCouponActive: (code: string, active: boolean) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  redeemCoupon: (code: string) => Promise<RedeemedCoupon>;
}

const CouponsContext = createContext<CouponsContextValue | undefined>(undefined);

export function CouponsProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCoupons = async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error("No se pudieron cargar los cupones", error);
      } else {
        setCoupons((data as CouponRow[]).map(rowToCoupon));
      }
      setIsLoading(false);
    };

    fetchCoupons();

    // Solo el admin autenticado puede ver la lista de cupones.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCoupons();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const addCoupon: CouponsContextValue["addCoupon"] = async (coupon) => {
    const code = coupon.code.trim().toUpperCase();
    const { data, error } = await supabase
      .from("coupons")
      .insert({
        code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        usage_limit: coupon.usageLimit,
      })
      .select()
      .single();

    if (error) throw error;
    setCoupons((current) => [rowToCoupon(data as CouponRow), ...current]);
  };

  const setCouponActive = async (code: string, active: boolean) => {
    const { error } = await supabase.from("coupons").update({ active }).eq("code", code);
    if (error) throw error;
    setCoupons((current) => current.map((coupon) => (coupon.code === code ? { ...coupon, active } : coupon)));
  };

  const deleteCoupon = async (code: string) => {
    const { error } = await supabase.from("coupons").delete().eq("code", code);
    if (error) throw error;
    setCoupons((current) => current.filter((coupon) => coupon.code !== code));
  };

  const redeemCoupon = async (code: string): Promise<RedeemedCoupon> => {
    const normalizedCode = code.trim().toUpperCase();
    const { data, error } = await supabase.rpc("redeem_coupon", { p_code: normalizedCode });

    if (error) {
      if (error.message.includes("CUPON_AGOTADO")) {
        throw new Error("Este cupón ya alcanzó su límite de usos.");
      }
      throw new Error("Ese código de cupón no es válido.");
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) throw new Error("Ese código de cupón no es válido.");

    return {
      code: normalizedCode,
      discountType: result.discount_type,
      discountValue: Number(result.discount_value),
    };
  };

  const value: CouponsContextValue = { coupons, isLoading, addCoupon, setCouponActive, deleteCoupon, redeemCoupon };

  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>;
}

export function useCoupons(): CouponsContextValue {
  const context = useContext(CouponsContext);
  if (!context) throw new Error("useCoupons must be used within a CouponsProvider");
  return context;
}
