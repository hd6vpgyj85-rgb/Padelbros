import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useLoyalty } from "../context/LoyaltyContext";
import { getWhatsAppUrl } from "../data/store";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RacketPlaceholderIcon } from "../components/home/icons";
import CategoryFooter from "../components/category/CategoryFooter";
import "./FidelidadPage.css";

interface PublicCustomer {
  id: string;
  name: string;
  purchasesCount: number;
}

interface PublicClaim {
  tierId: string;
  requestedAt: string;
  claimed: boolean;
  claimedAt?: string;
  couponCode?: string;
}

type Status = "loading" | "found" | "not-found";

function buildClaimMessage(customerName: string, purchasesCount: number, rewardDescription: string): string {
  return [
    "🎾 *Reclamo de recompensa - Padelbros*",
    "",
    `Nombre: ${customerName}`,
    `Compras acumuladas: ${purchasesCount}`,
    `Recompensa: ${rewardDescription}`,
    "",
    "Quiero reclamar mi recompensa de fidelidad.",
  ].join("\n");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function FidelidadPage() {
  useDocumentTitle("Tarjeta de fidelidad | Padelbros");
  const { token } = useParams<{ token: string }>();
  const { tiers } = useLoyalty();

  const [status, setStatus] = useState<Status>("loading");
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [claims, setClaims] = useState<PublicClaim[]>([]);
  const [claimingTierId, setClaimingTierId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("not-found");
      return;
    }

    let cancelled = false;

    const fetchCard = async () => {
      const { data: customerRows, error: customerError } = await supabase.rpc("get_customer_by_token", {
        p_token: token,
      });

      if (cancelled) return;

      if (customerError || !customerRows || customerRows.length === 0) {
        setStatus("not-found");
        return;
      }

      const row = customerRows[0] as { id: string; name: string; purchases_count: number };
      setCustomer({ id: row.id, name: row.name, purchasesCount: row.purchases_count });

      const { data: claimRows, error: claimsError } = await supabase.rpc("get_loyalty_claims_by_token", {
        p_token: token,
      });

      if (cancelled) return;

      if (!claimsError && claimRows) {
        setClaims(
          (
            claimRows as {
              tier_id: string;
              requested_at: string;
              claimed: boolean;
              claimed_at: string | null;
              coupon_code: string | null;
            }[]
          ).map((claim) => ({
            tierId: claim.tier_id,
            requestedAt: claim.requested_at,
            claimed: claim.claimed,
            claimedAt: claim.claimed_at ?? undefined,
            couponCode: claim.coupon_code ?? undefined,
          })),
        );
      }

      setStatus("found");
    };

    fetchCard();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleClaim = async (tier: { id: string; rewardDescription: string }) => {
    if (!token || !customer) return;
    setClaimingTierId(tier.id);
    setClaimError("");
    try {
      const { error } = await supabase.rpc("request_loyalty_claim", { p_token: token, p_tier_id: tier.id });
      if (error) throw error;

      setClaims((current) =>
        current.some((claim) => claim.tierId === tier.id)
          ? current
          : [...current, { tierId: tier.id, requestedAt: new Date().toISOString(), claimed: false }],
      );

      const message = buildClaimMessage(customer.name, customer.purchasesCount, tier.rewardDescription);
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    } catch {
      setClaimError("No se pudo enviar tu reclamo. Intenta de nuevo.");
    } finally {
      setClaimingTierId(null);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (status === "not-found" || !customer) {
    return (
      <div className="not-found-page">
        <div className="container not-found-page__content">
          <RacketPlaceholderIcon className="not-found-page__icon" />
          <span className="eyebrow">Fidelidad</span>
          <h1 className="not-found-page__title">Tarjeta no encontrada</h1>
          <p className="not-found-page__text">
            El enlace no es válido. Pide a Padelbros que te comparta de nuevo tu código QR.
          </p>
          <Link to="/" className="btn btn--primary">
            Volver al inicio
          </Link>
        </div>
        <CategoryFooter />
      </div>
    );
  }

  const nextTier = tiers.find((tier) => tier.purchasesRequired > customer.purchasesCount);
  const progressPercent = nextTier
    ? Math.min(100, Math.round((customer.purchasesCount / nextTier.purchasesRequired) * 100))
    : 100;

  return (
    <div className="fidelidad-page">
      <div className="container fidelidad-page__content">
        <span className="eyebrow">Padelbros</span>
        <h1 className="fidelidad-page__title">Tarjeta de fidelidad</h1>

        <div className="fidelidad-card">
          <p className="fidelidad-card__name">{customer.name}</p>
          <p className="fidelidad-card__count">
            <strong>{customer.purchasesCount}</strong> compras acumuladas
          </p>

          <div className="fidelidad-progress">
            <div className="fidelidad-progress__bar">
              <div className="fidelidad-progress__fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="fidelidad-progress__label">
              {nextTier
                ? `${customer.purchasesCount} / ${nextTier.purchasesRequired} compras para tu próximo nivel`
                : "¡Desbloqueaste todos los niveles disponibles!"}
            </p>
          </div>
        </div>

        {claimError && <p className="fidelidad-page__error">{claimError}</p>}

        <ul className="fidelidad-tiers">
          {tiers.map((tier) => {
            const achieved = customer.purchasesCount >= tier.purchasesRequired;
            const claim = claims.find((item) => item.tierId === tier.id);
            const isBusy = claimingTierId === tier.id;

            return (
              <li
                key={tier.id}
                className={`fidelidad-tier${achieved ? " fidelidad-tier--achieved" : " fidelidad-tier--locked"}`}
              >
                <div className="fidelidad-tier__marker" aria-hidden="true">
                  {achieved ? "✓" : tier.purchasesRequired}
                </div>

                <div className="fidelidad-tier__body">
                  <p className="fidelidad-tier__req">{tier.purchasesRequired} compras</p>
                  <p className="fidelidad-tier__desc">{tier.rewardDescription}</p>

                  {achieved && !claim && (
                    <button
                      type="button"
                      className="btn btn--primary fidelidad-tier__btn"
                      onClick={() => handleClaim(tier)}
                      disabled={isBusy}
                    >
                      {isBusy ? "Enviando..." : "Reclamar recompensa"}
                    </button>
                  )}

                  {achieved && claim && !claim.claimed && (
                    <p className="fidelidad-tier__status fidelidad-tier__status--pending">
                      Pendiente de confirmar · pedido el {formatDate(claim.requestedAt)}
                    </p>
                  )}

                  {achieved && claim && claim.claimed && (
                    <p className="fidelidad-tier__status fidelidad-tier__status--claimed">
                      ¡Reclamado! {claim.couponCode ? `Cupón: ${claim.couponCode}` : ""}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <CategoryFooter />
    </div>
  );
}

export default FidelidadPage;
