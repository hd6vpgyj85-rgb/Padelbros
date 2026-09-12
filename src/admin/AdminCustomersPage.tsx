import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCustomers, type Customer } from "../context/CustomersContext";
import { useLoyalty } from "../context/LoyaltyContext";
import { MinusIcon, PlusIcon } from "../components/home/icons";
import CustomerQrModal from "./CustomerQrModal";
import CustomerRewardsModal from "./CustomerRewardsModal";
import "./AdminCustomersPage.css";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function AdminCustomersPage() {
  const { customers, isLoading, deleteCustomer, setPurchasesCount } = useCustomers();
  const { tiers, claims, addTier, updateTier, deleteTier } = useLoyalty();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [showTiers, setShowTiers] = useState(false);
  const [qrCustomer, setQrCustomer] = useState<Customer | null>(null);
  const [rewardsCustomer, setRewardsCustomer] = useState<Customer | null>(null);

  const autoQrId = searchParams.get("qr");
  const autoQrCustomer = autoQrId ? customers.find((customer) => customer.id === autoQrId) : undefined;
  const activeQrCustomer = qrCustomer ?? autoQrCustomer ?? null;

  const closeQrModal = () => {
    setQrCustomer(null);
    if (autoQrId) {
      searchParams.delete("qr");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = normalize(searchQuery);
    return customers.filter((customer) =>
      normalize(`${customer.name} ${customer.phone} ${customer.notes ?? ""}`).includes(query),
    );
  }, [customers, searchQuery]);

  const pendingClaimCustomerIds = useMemo(
    () => new Set(claims.filter((claim) => !claim.claimed).map((claim) => claim.customerId)),
    [claims],
  );

  const handleDelete = (customer: Customer) => {
    if (!window.confirm(`¿Eliminar a ${customer.name}? Esta acción no se puede deshacer.`)) return;
    deleteCustomer(customer.id).catch(() => {
      window.alert("No se pudo eliminar el cliente. Intenta de nuevo.");
    });
  };

  const handlePurchaseChange = (customer: Customer, delta: number) => {
    setPurchasesCount(customer.id, customer.purchasesCount + delta).catch(() => {
      window.alert("No se pudo actualizar el conteo de compras.");
    });
  };

  return (
    <div className="admin-customers container">
      <div className="admin-customers__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-customers__title">Clientes</h1>
        </div>
        <Link to="/admin/clientes/nuevo" className="btn btn--primary admin-customers__new">
          Nuevo cliente
        </Link>
      </div>

      <button type="button" className="admin-customers__tiers-toggle" onClick={() => setShowTiers((v) => !v)}>
        {showTiers ? "Ocultar niveles del programa" : "Ver / editar niveles del programa"}
      </button>

      {showTiers && <TiersManager tiers={tiers} onAdd={addTier} onUpdate={updateTier} onDelete={deleteTier} />}

      {customers.length > 0 && (
        <input
          type="search"
          className="admin-customers__search"
          placeholder="Buscar por nombre o WhatsApp..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      )}

      {isLoading ? null : customers.length === 0 ? (
        <p className="admin-customers__empty">Todavía no hay clientes.</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="admin-customers__empty">No hay clientes que coincidan con la búsqueda.</p>
      ) : (
        <ul className="admin-customers__list">
          {filteredCustomers.map((customer) => (
            <li
              key={customer.id}
              className={`admin-customer-card${pendingClaimCustomerIds.has(customer.id) ? " admin-customer-card--pending" : ""}`}
            >
              {pendingClaimCustomerIds.has(customer.id) && (
                <span className="admin-customer-card__badge">Reclamo pendiente</span>
              )}

              <p className="admin-customer-card__name">{customer.name}</p>
              <p className="admin-customer-card__phone">{customer.phone}</p>
              {customer.notes && <p className="admin-customer-card__notes">{customer.notes}</p>}

              <div className="admin-customer-card__purchases">
                <span>Compras</span>
                <div className="admin-customer-card__stepper">
                  <button
                    type="button"
                    onClick={() => handlePurchaseChange(customer, -1)}
                    aria-label="Restar compra"
                    disabled={customer.purchasesCount === 0}
                  >
                    <MinusIcon />
                  </button>
                  <span className="admin-customer-card__count">{customer.purchasesCount}</span>
                  <button type="button" onClick={() => handlePurchaseChange(customer, 1)} aria-label="Sumar compra">
                    <PlusIcon />
                  </button>
                </div>
              </div>

              <div className="admin-customer-card__actions">
                <button type="button" className="admin-customer-card__btn" onClick={() => setQrCustomer(customer)}>
                  Ver QR
                </button>
                <button
                  type="button"
                  className="admin-customer-card__btn"
                  onClick={() => setRewardsCustomer(customer)}
                >
                  Recompensas
                </button>
                <Link to={`/admin/clientes/${customer.id}`} className="admin-customer-card__btn">
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-customer-card__btn admin-customer-card__btn--delete"
                  onClick={() => handleDelete(customer)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeQrCustomer && (
        <CustomerQrModal
          customerName={activeQrCustomer.name}
          token={activeQrCustomer.token}
          onClose={closeQrModal}
        />
      )}

      {rewardsCustomer && (
        <CustomerRewardsModal customer={rewardsCustomer} onClose={() => setRewardsCustomer(null)} />
      )}
    </div>
  );
}

interface TiersManagerProps {
  tiers: { id: string; purchasesRequired: number; rewardDescription: string; discountPercent?: number }[];
  onAdd: (tier: { purchasesRequired: number; rewardDescription: string; discountPercent?: number }) => Promise<void>;
  onUpdate: (
    id: string,
    tier: { purchasesRequired: number; rewardDescription: string; discountPercent?: number },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function TiersManager({ tiers, onAdd, onUpdate, onDelete }: TiersManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [purchasesRequired, setPurchasesRequired] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setPurchasesRequired("");
    setRewardDescription("");
    setDiscountPercent("");
  };

  const startEdit = (tier: TiersManagerProps["tiers"][number]) => {
    setEditingId(tier.id);
    setPurchasesRequired(String(tier.purchasesRequired));
    setRewardDescription(tier.rewardDescription);
    setDiscountPercent(tier.discountPercent ? String(tier.discountPercent) : "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        purchasesRequired: Number(purchasesRequired) || 0,
        rewardDescription: rewardDescription.trim(),
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
      };
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onAdd(payload);
      }
      resetForm();
    } catch {
      setError("No se pudo guardar el nivel. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este nivel del programa?")) return;
    try {
      await onDelete(id);
      if (editingId === id) resetForm();
    } catch {
      window.alert("No se pudo eliminar el nivel.");
    }
  };

  return (
    <div className="admin-tiers">
      {tiers.length > 0 && (
        <ul className="admin-tiers__list">
          {tiers.map((tier) => (
            <li key={tier.id} className="admin-tier-row">
              <div className="admin-tier-row__info">
                <p className="admin-tier-row__req">{tier.purchasesRequired} compras</p>
                <p className="admin-tier-row__desc">{tier.rewardDescription}</p>
                {tier.discountPercent && <p className="admin-tier-row__discount">{tier.discountPercent}% de descuento</p>}
              </div>
              <div className="admin-tier-row__actions">
                <button type="button" onClick={() => startEdit(tier)}>
                  Editar
                </button>
                <button type="button" onClick={() => handleDelete(tier.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="admin-tiers__form" onSubmit={handleSubmit}>
        <p className="admin-tiers__form-title">{editingId ? "Editar nivel" : "Nuevo nivel"}</p>
        <div className="admin-field-row">
          <label className="admin-field">
            <span>Compras requeridas *</span>
            <input
              type="number"
              min="1"
              required
              value={purchasesRequired}
              onChange={(event) => setPurchasesRequired(event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Descuento % (opcional)</span>
            <input
              type="number"
              min="1"
              max="100"
              value={discountPercent}
              onChange={(event) => setDiscountPercent(event.target.value)}
            />
          </label>
        </div>
        <label className="admin-field">
          <span>Recompensa *</span>
          <input
            type="text"
            required
            placeholder="Ej. 10% de descuento en tu próxima compra"
            value={rewardDescription}
            onChange={(event) => setRewardDescription(event.target.value)}
          />
        </label>

        {error && <p className="admin-product-form__error">{error}</p>}

        <div className="admin-tiers__form-actions">
          {editingId && (
            <button type="button" className="btn btn--outline" onClick={resetForm}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar nivel"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCustomersPage;
