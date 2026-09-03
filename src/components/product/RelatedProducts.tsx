import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { products } from "../../data/products";
import { RacketPlaceholderIcon } from "../home/icons";
import { shuffle } from "../../utils/array";
import { formatPrice } from "../../utils/format";
import "./RelatedProducts.css";

interface RelatedProductsProps {
  excludeId?: string;
  count?: number;
  variant?: "default" | "light";
}

function RelatedProducts({ excludeId, count = 4, variant = "default" }: RelatedProductsProps) {
  const { addItem } = useCart();

  const items = useMemo(() => {
    const pool = excludeId ? products.filter((product) => product.id !== excludeId) : products;
    return shuffle(pool).slice(0, count);
  }, [excludeId, count]);

  if (items.length === 0) return null;

  return (
    <div className={`related-products${variant === "light" ? " related-products--light" : ""}`}>
      {items.map((product) => {
        const isOutOfStock = product.stock === 0;

        return (
          <article className="related-product-card" key={product.id}>
            <Link to={`/producto/${product.id}`} className="related-product-card__media">
              {isOutOfStock && <span className="related-product-card__badge">Agotado</span>}
              <RacketPlaceholderIcon className="related-product-card__placeholder" />
            </Link>

            <Link to={`/producto/${product.id}`} className="related-product-card__name">
              {product.name}
            </Link>

            <p className="related-product-card__price">{formatPrice(product.price)}</p>

            <button
              type="button"
              className="related-product-card__add"
              disabled={isOutOfStock}
              onClick={() => addItem(product.id, 1)}
            >
              {isOutOfStock ? "Agotado" : "Agregar al carrito"}
            </button>
          </article>
        );
      })}
    </div>
  );
}

export default RelatedProducts;
