import { useMemo } from "react";
import { useProducts } from "../context/ProductsContext";
import { categories } from "../data/categories";
import "./AdminCategoriesPage.css";

function AdminCategoriesPage() {
  const { products } = useProducts();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of products) {
      map.set(product.category, (map.get(product.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const onSaleCount = useMemo(() => products.filter((product) => product.onSale).length, [products]);

  return (
    <div className="admin-categories container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-categories__title">Colecciones</h1>
      <p className="admin-categories__hint">
        Las colecciones están ligadas a las secciones del sitio. Para agregar productos a una, edítalos
        desde la sección de Productos.
      </p>

      <ul className="admin-categories__list">
        {categories.map((category) => (
          <li key={category.id} className="admin-category-row">
            <span className="admin-category-row__name">{category.name}</span>
            <span className="admin-category-row__meta">
              Visible ·{" "}
              {category.id === "ofertas" ? onSaleCount : counts.get(category.id) ?? 0} productos
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategoriesPage;
