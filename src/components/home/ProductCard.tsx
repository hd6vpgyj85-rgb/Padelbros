import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/product";
import { RacketPlaceholderIcon } from "./icons";
import "./ProductCard.css";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/producto/${product.id}`} className="product-card__link">
        <div className="product-card__media">
          {product.onSale && <span className="product-card__badge">Promo</span>}
          <RacketPlaceholderIcon className="product-card__placeholder" />
        </div>

        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">
            {currencyFormatter.format(product.price)}
          </p>
        </div>
      </Link>

      <button
        className="product-card__add"
        type="button"
        aria-label={`Agregar ${product.name} al carrito`}
        onClick={() => addItem(product.id, 1)}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </article>
  );
}

export default ProductCard;
