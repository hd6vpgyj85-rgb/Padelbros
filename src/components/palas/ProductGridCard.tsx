import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/format";
import "./ProductGridCard.css";

interface ProductGridCardProps {
  product: Product;
}

function ProductGridCard({ product }: ProductGridCardProps) {
  return (
    <article className="product-grid-card">
      <div className="product-grid-card__media">
        <PlaceholderRacket />
      </div>
      <div className="product-grid-card__body">
        {product.vendor && <span className="product-grid-card__vendor">{product.vendor}</span>}
        <h3 className="product-grid-card__name">{product.name}</h3>
        <p className="product-grid-card__price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

function PlaceholderRacket() {
  return (
    <svg
      className="product-grid-card__placeholder"
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

export default ProductGridCard;
