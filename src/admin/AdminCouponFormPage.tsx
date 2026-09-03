import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCoupons, type DiscountType } from "../context/CouponsContext";
import "./AdminProductFormPage.css";

function AdminCouponFormPage() {
  const navigate = useNavigate();
  const { addCoupon } = useCoupons();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await addCoupon({
        code,
        discountType,
        discountValue: Number(discountValue) || 0,
        usageLimit: Number(usageLimit) || 1,
      });
      navigate("/admin/cupones");
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("duplicate")
          ? "Ya existe un cupón con ese código."
          : "No se pudo crear el cupón. Intenta de nuevo.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-product-form container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-product-form__title">Nuevo cupón</h1>

      <form onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>Código *</span>
          <input
            type="text"
            required
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="VERANO10"
          />
        </label>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Tipo de descuento *</span>
            <select value={discountType} onChange={(event) => setDiscountType(event.target.value as DiscountType)}>
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
          </label>

          <label className="admin-field">
            <span>{discountType === "percentage" ? "Porcentaje *" : "Monto ($) *"}</span>
            <input
              type="number"
              min="1"
              max={discountType === "percentage" ? "100" : undefined}
              step={discountType === "percentage" ? "1" : "0.01"}
              required
              value={discountValue}
              onChange={(event) => setDiscountValue(event.target.value)}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>¿Cuántas veces se puede usar? *</span>
          <input
            type="number"
            min="1"
            required
            value={usageLimit}
            onChange={(event) => setUsageLimit(event.target.value)}
          />
        </label>

        {submitError && <p className="admin-product-form__error">{submitError}</p>}

        <button type="submit" className="btn btn--primary admin-product-form__submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear cupón"}
        </button>
      </form>
    </div>
  );
}

export default AdminCouponFormPage;
