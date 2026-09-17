import { useMemo } from "react";
import { useProducts } from "../../context/ProductsContext";
import { useAnalytics } from "../../context/AnalyticsContext";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { getMostClickedProducts } from "../../utils/catalog";
import ProductCard from "./ProductCard";
import "./TopProducts.css";

const FEATURED_COUNT = 3;

function TopProducts() {
  const { products } = useProducts();
  const { views } = useAnalytics();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  const topProducts = useMemo(
    () => getMostClickedProducts(products, FEATURED_COUNT, views),
    [products, views],
  );

  return (
    <section className="top-products" id="top-palas" ref={ref}>
      <div className="container">
        <span className={`eyebrow reveal${isVisible ? " reveal--visible" : ""}`}>Top Palas</span>
        <h2
          className={`section-title reveal${isVisible ? " reveal--visible" : ""}`}
          style={{ transitionDelay: "0.08s" }}
        >
          Top productos de la semana
        </h2>

        <div className="top-products__grid">
          {topProducts.map((product, index) => (
            <div
              className={`reveal${isVisible ? " reveal--visible" : ""}`}
              style={{ transitionDelay: `${0.16 + index * 0.1}s` }}
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopProducts;
