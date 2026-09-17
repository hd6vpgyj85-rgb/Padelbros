import type { Product } from "../../types/product";
import { BallIcon } from "../home/icons";
import ProductGridCard from "./ProductGridCard";
import "./ProductGrid.css";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "search";
  emptyMessage?: string;
}

function ProductGrid({
  products,
  variant = "default",
  emptyMessage = "No hay productos disponibles con este filtro por el momento.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="container product-grid__empty">
        <BallIcon className="product-grid__empty-ball" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="container product-grid">
      {products.map((product, index) => (
        <ProductGridCard key={product.id} product={product} variant={variant} index={index} />
      ))}
    </div>
  );
}

export default ProductGrid;
