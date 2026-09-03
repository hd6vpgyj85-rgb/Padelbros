import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { RacketPlaceholderIcon } from "../home/icons";
import { formatPrice } from "../../utils/format";
import "./ProductGridCard.css";

interface ProductGridCardProps {
  product: Product;
  variant?: "default" | "search";
}

function ProductGridCard({ product, variant = "default" }: ProductGridCardProps) {
  const isOutOfStock = product.stock === 0;

  const className = [
    "product-grid-card",
    variant === "search" && "product-grid-card--search",
    isOutOfStock && "product-grid-card--out-of-stock",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link to={`/producto/${product.id}`} className={className}>
      <div className="product-grid-card__media">
        {isOutOfStock && <span className="product-grid-card__badge">Agotado</span>}
        <RacketPlaceholderIcon className="product-grid-card__placeholder" />
      </div>
      <div className="product-grid-card__body">
        {product.vendor && <span className="product-grid-card__vendor">{product.vendor}</span>}
        <h3 className="product-grid-card__name">{product.name}</h3>
        <p className="product-grid-card__price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export default ProductGridCard;
