import type { Product } from "../../types/product";
import ProductGridCard from "./ProductGridCard";
import "./ProductGrid.css";

interface ProductGridProps {
  products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="container product-grid__empty">
        <p>No hay productos disponibles con este filtro por el momento.</p>
      </div>
    );
  }

  return (
    <div className="container product-grid">
      {products.map((product) => (
        <ProductGridCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
