import { useMemo } from "react";
import { useProducts } from "../../context/ProductsContext";
import { useOrders } from "../../context/OrdersContext";
import { useAnalytics } from "../../context/AnalyticsContext";
import { getPopularProducts } from "../../utils/catalog";
import ProductCard from "./ProductCard";
import "./TopProducts.css";

const FEATURED_COUNT = 3;

function TopProducts() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { views, cartAdds } = useAnalytics();

  const purchases = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const order of orders) {
      for (const item of order.items) {
        counts[item.productId] = (counts[item.productId] ?? 0) + item.quantity;
      }
    }
    return counts;
  }, [orders]);

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
