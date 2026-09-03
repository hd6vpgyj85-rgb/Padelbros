import type { Product } from "../../types/product";
import "./ProductCard.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        {product.onSale && <span className="product-card__badge">Promo</span>}
        <PlaceholderRacket />
      </div>

      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">
            {currencyFormatter.format(product.price)}
          </p>
        </div>

        <button
          className="product-card__add"
          type="button"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </article>
  );
}

function PlaceholderRacket() {
  return (
    <svg
      className="product-card__placeholder"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="28" y="10" width="44" height="52" rx="18" stroke="currentColor" strokeWidth="2.5" />
      <line x1="50" y1="62" x2="50" y2="82" stroke="currentColor" strokeWidth="2.5" />
      <rect x="42" y="82" width="16" height="8" rx="3" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export default ProductCard;
