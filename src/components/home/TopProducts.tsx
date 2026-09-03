import { useMemo } from "react";
import { useProducts } from "../../context/ProductsContext";
import { useAnalytics } from "../../context/AnalyticsContext";
import { getPopularProducts } from "../../utils/catalog";
import ProductCard from "./ProductCard";
import "./TopProducts.css";

const FEATURED_COUNT = 3;

function TopProducts() {
  const { products } = useProducts();
  const { views, cartAdds, purchases } = useAnalytics();

  const popularProducts = useMemo(
    () => getPopularProducts(products, FEATURED_COUNT, { views, cartAdds, purchases }),
    [products, views, cartAdds, purchases],
  );

  return (
    <section className="top-products" id="top-palas">
      <div className="container">
        <span className="eyebrow">Top Palas</span>
        <h2 className="section-title">Destacadas de la semana</h2>

        <div className="top-products__grid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopProducts;
