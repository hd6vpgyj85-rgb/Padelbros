import { Link } from "react-router-dom";
import { useCoupons } from "../context/CouponsContext";
import { formatPrice } from "../utils/format";
import "./AdminCouponsPage.css";

function formatDiscount(discountType: "percentage" | "fixed", discountValue: number): string {
  return discountType === "percentage" ? `${discountValue}% de descuento` : `${formatPrice(discountValue)} de descuento`;
}

function AdminCouponsPage() {
  const { coupons, setCouponActive, deleteCoupon } = useCoupons();

  const handleDelete = (code: string) => {
    if (!window.confirm(`¿Eliminar el cupón "${code}"? Esta acción no se puede deshacer.`)) return;
    deleteCoupon(code);
  };

  return (
    <div className="admin-coupons container">
      <div className="admin-coupons__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-coupons__title">Cupones</h1>
        </div>
        <Link to="/admin/cupones/nuevo" className="btn btn--primary admin-coupons__new">
          Nuevo cupón
        </Link>
      </div>

      {coupons.length === 0 ? (
        <p className="admin-coupons__empty">Todavía no hay cupones.</p>
      ) : (
        <ul className="admin-coupons__list">
          {coupons.map((coupon) => {
            const isExhausted = coupon.timesUsed >= coupon.usageLimit;
            return (
              <li key={coupon.code} className="admin-coupon-card">
                <div className="admin-coupon-card__header">
                  <span className="admin-coupon-card__code">{coupon.code}</span>
                  <span
                    className={`admin-coupon-card__status${coupon.active && !isExhausted ? " admin-coupon-card__status--active" : ""}`}
                  >
                    {!coupon.active ? "Desactivado" : isExhausted ? "Agotado" : "Activo"}
                  </span>
                </div>

                <p className="admin-coupon-card__discount">
                  {formatDiscount(coupon.discountType, coupon.discountValue)}
                </p>
                <p className="admin-coupon-card__usage">
                  Usos: {coupon.timesUsed} / {coupon.usageLimit}
                </p>

                <div className="admin-coupon-card__actions">
                  <button
                    type="button"
                    className="admin-coupon-card__btn"
                    onClick={() => setCouponActive(coupon.code, !coupon.active)}
                  >
                    {coupon.active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    type="button"
                    className="admin-coupon-card__btn admin-coupon-card__btn--delete"
                    onClick={() => handleDelete(coupon.code)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminCouponsPage;
