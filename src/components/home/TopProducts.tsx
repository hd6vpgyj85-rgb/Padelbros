import { useMemo } from "react";
import { useProducts } from "../../context/ProductsContext";
import { featuredIds } from "../../data/products";
import { getFeaturedProducts } from "../../utils/catalog";
import ProductCard from "./ProductCard";
import "./TopProducts.css";

function TopProducts() {
  const { products } = useProducts();
  const featuredProducts = useMemo(() => getFeaturedProducts(products, featuredIds), [products]);

  return (
    <section className="top-products" id="top-palas">
      <div className="container">
        <span className="eyebrow">Top Palas</span>
        <h2 className="section-title">Destacadas de la semana</h2>

        <div className="top-products__grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopProducts;
