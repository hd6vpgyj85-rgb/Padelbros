import { useEffect, useRef, useState } from "react";
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
  const [isPhotoLoaded, setIsPhotoLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const isOnSale = Boolean(product.onSale && product.compareAtPrice);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleAdd = () => {
    addItem(product.id, 1);
    setJustAdded(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="product-card">
      <Link to={`/producto/${product.id}`} className="product-card__link">
        <div className="product-card__media">
          {isOnSale && <span className="product-card__badge">Oferta</span>}
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onLoad={() => setIsPhotoLoaded(true)}
              className={`product-card__photo img-fade${isPhotoLoaded ? " img-fade--loaded" : ""}`}
              style={{ objectFit: product.homeImageFit ?? "cover" }}
            />
          ) : (
            <RacketPlaceholderIcon className="product-card__placeholder" />
          )}
        </div>

        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__price-row">
            {isOnSale && (
              <span className="product-card__price-old">{currencyFormatter.format(product.compareAtPrice!)}</span>
            )}
            <p className="product-card__price">{currencyFormatter.format(product.price)}</p>
          </div>
        </div>
      </Link>

      <button
        className={`product-card__add${justAdded ? " product-card__add--added" : ""}`}
        type="button"
        aria-label={justAdded ? `${product.name} agregado al carrito` : `Agregar ${product.name} al carrito`}
        onClick={handleAdd}
      >
        {justAdded ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="5 12.5 10 17.5 19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </article>
  );
}

export default ProductCard;
