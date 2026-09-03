import { featuredProducts } from "../../data/products";
import ProductCard from "./ProductCard";
import "./TopProducts.css";

function TopProducts() {
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
