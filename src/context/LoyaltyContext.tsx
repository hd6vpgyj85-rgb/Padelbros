import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export interface LoyaltyTier {
  id: string;
  purchasesRequired: number;
  rewardDescription: string;
  discountPercent?: number;
}

export interface LoyaltyClaim {
  id: string;
  customerId: string;
  tierId: string;
  requestedAt: string;
  claimed: boolean;
  claimedAt?: string;
  couponId?: string;
}

interface TierRow {
  id: string;
  purchases_required: number;
  reward_description: string;
  discount_percent: number | null;
}

interface ClaimRow {
  id: string;
  customer_id: string;
  tier_id: string;
  requested_at: string;
  claimed: boolean;
  claimed_at: string | null;
  coupon_id: string | null;
}

function rowToTier(row: TierRow): LoyaltyTier {
  return {
    id: row.id,
    purchasesRequired: row.purchases_required,
    rewardDescription: row.reward_description,
    discountPercent: row.discount_percent ?? undefined,
  };
}

function rowToClaim(row: ClaimRow): LoyaltyClaim {
  return {
    id: row.id,
    customerId: row.customer_id,
    tierId: row.tier_id,
    requestedAt: row.requested_at,
    claimed: row.claimed,
    claimedAt: row.claimed_at ?? undefined,
    couponId: row.coupon_id ?? undefined,
  };
}

interface LoyaltyContextValue {
  tiers: LoyaltyTier[];
  claims: LoyaltyClaim[];
  isLoading: boolean;
  addTier: (tier: { purchasesRequired: number; rewardDescription: string; discountPercent?: number }) => Promise<void>;
  updateTier: (
    id: string,
    tier: { purchasesRequired: number; rewardDescription: string; discountPercent?: number },
  ) => Promise<void>;
  deleteTier: (id: string) => Promise<void>;
  confirmClaim: (claimId: string) => Promise<void>;
  revertClaim: (claimId: string) => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextValue | undefined>(undefined);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [claims, setClaims] = useState<LoyaltyClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = async () => {
    const { data, error } = await supabase.from("loyalty_claims").select("*");
    if (!error) setClaims((data as ClaimRow[]).map(rowToClaim));
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("loyalty_tiers")
        .select("*")
        .order("purchases_required", { ascending: true });

      if (cancelled) return;
      if (error) {
        console.error("No se pudieron cargar los niveles de fidelidad", error);
      } else {
        setTiers((data as TierRow[]).map(rowToTier));
      }

      await fetchClaims();
      if (cancelled) return;
      setIsLoading(false);
    };

    fetchAll();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchAll();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const addTier: LoyaltyContextValue["addTier"] = async (tier) => {
    const { data, error } = await supabase
      .from("loyalty_tiers")
      .insert({
        purchases_required: tier.purchasesRequired,
        reward_description: tier.rewardDescription,
        discount_percent: tier.discountPercent ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    setTiers((current) =>
      [...current, rowToTier(data as TierRow)].sort((a, b) => a.purchasesRequired - b.purchasesRequired),
    );
  };

  const updateTier: LoyaltyContextValue["updateTier"] = async (id, tier) => {
    const { data, error } = await supabase
      .from("loyalty_tiers")
      .update({
        purchases_required: tier.purchasesRequired,
        reward_description: tier.rewardDescription,
        discount_percent: tier.discountPercent ?? null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setTiers((current) =>
      current
        .map((existing) => (existing.id === id ? rowToTier(data as TierRow) : existing))
        .sort((a, b) => a.purchasesRequired - b.purchasesRequired),
    );
  };

  const deleteTier = async (id: string) => {
    const { error, count } = await supabase.from("loyalty_tiers").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    if (!count) throw new Error("No se pudo eliminar el nivel. Verifica los permisos e intenta de nuevo.");
    setTiers((current) => current.filter((tier) => tier.id !== id));
  };

  const confirmClaim = async (claimId: string) => {
    const { error } = await supabase.rpc("confirm_loyalty_claim", { p_claim_id: claimId });
    if (error) throw error;
    await fetchClaims();
  };

  const revertClaim = async (claimId: string) => {
    const { error } = await supabase.rpc("revert_loyalty_claim", { p_claim_id: claimId });
    if (error) throw error;
    await fetchClaims();
  };

  const value: LoyaltyContextValue = {
    tiers,
    claims,
    isLoading,
    addTier,
    updateTier,
    deleteTier,
    confirmClaim,
    revertClaim,
  };

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
}

export function useLoyalty(): LoyaltyContextValue {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error("useLoyalty must be used within a LoyaltyProvider");
  return context;
}
