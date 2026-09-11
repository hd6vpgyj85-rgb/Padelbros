import { useState } from "react";
import { createPortal } from "react-dom";
import { useLoyalty } from "../context/LoyaltyContext";
import type { Customer } from "../context/CustomersContext";
import { CloseIcon } from "../components/home/icons";
import "./CustomerRewardsModal.css";

interface CustomerRewardsModalProps {
  customer: Customer;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function CustomerRewardsModal({ customer, onClose }: CustomerRewardsModalProps) {
  const { tiers, claims, confirmClaim, revertClaim } = useLoyalty();
  const [busyTierId, setBusyTierId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const unlockedTiers = tiers.filter((tier) => customer.purchasesCount >= tier.purchasesRequired);

  const handleConfirm = async (claimId: string, tierId: string) => {
    setBusyTierId(tierId);
    setError("");
    try {
      await confirmClaim(claimId);
    } catch {
      setError("No se pudo confirmar el reclamo. Intenta de nuevo.");
    } finally {
      setBusyTierId(null);
    }
  };

  const handleRevert = async (claimId: string, tierId: string) => {
    if (!window.confirm("¿Revertir esta confirmación? El cupón generado se desactivará.")) return;
    setBusyTierId(tierId);
    setError("");
    try {
      await revertClaim(claimId);
    } catch {
      setError("No se pudo revertir el reclamo. Intenta de nuevo.");
    } finally {
      setBusyTierId(null);
    }
  };

  return createPortal(
    <div className="customer-rewards-modal__overlay" onClick={onClose}>
      <div className="customer-rewards-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="customer-rewards-modal__close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </button>

        <span className="eyebrow">Recompensas</span>
        <h2 className="customer-rewards-modal__name">{customer.name}</h2>
        <p className="customer-rewards-modal__count">{customer.purchasesCount} compras acumuladas</p>

        {unlockedTiers.length === 0 ? (
          <p className="customer-rewards-modal__empty">Todavía no desbloquea ningún nivel.</p>
        ) : (
          <ul className="customer-rewards-modal__list">
            {unlockedTiers.map((tier) => {
              const claim = claims.find((item) => item.customerId === customer.id && item.tierId === tier.id);
              const isBusy = busyTierId === tier.id;

              return (
                <li className="customer-reward-row" key={tier.id}>
                  <div className="customer-reward-row__info">
                    <p className="customer-reward-row__reward">{tier.rewardDescription}</p>
                    <p className="customer-reward-row__requirement">{tier.purchasesRequired} compras</p>
                  </div>

                  {!claim && <span className="customer-reward-row__status">No reclamado</span>}

                  {claim && !claim.claimed && (
                    <div className="customer-reward-row__pending">
                      <span className="customer-reward-row__status customer-reward-row__status--pending">
                        Pendiente · pedido el {formatDate(claim.requestedAt)}
                      </span>
                      <button
                        type="button"
                        className="customer-reward-row__btn"
                        onClick={() => handleConfirm(claim.id, tier.id)}
                        disabled={isBusy}
                      >
                        {isBusy ? "Confirmando..." : "Confirmar"}
                      </button>
                    </div>
                  )}

                  {claim && claim.claimed && (
                    <div className="customer-reward-row__pending">
                      <span className="customer-reward-row__status customer-reward-row__status--claimed">
                        Reclamado el {formatDate(claim.claimedAt ?? claim.requestedAt)}
                        {claim.couponId && <> · Cupón {claim.couponId}</>}
                      </span>
                      <button
                        type="button"
                        className="customer-reward-row__btn customer-reward-row__btn--outline"
                        onClick={() => handleRevert(claim.id, tier.id)}
                        disabled={isBusy}
                      >
                        {isBusy ? "Revirtiendo..." : "Revertir"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {error && <p className="customer-rewards-modal__error">{error}</p>}
      </div>
    </div>,
    document.body,
  );
}

export default CustomerRewardsModal;
