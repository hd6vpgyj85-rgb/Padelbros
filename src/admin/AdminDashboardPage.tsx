import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useOrders } from "../context/OrdersContext";
import { categories } from "../data/categories";
import { BoxIcon } from "./icons";
import { CartIcon, LayersIcon } from "../components/home/icons";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const pendingOrders = orders.filter((order) => order.status === "pendiente").length;

  const stats = [
    { label: "Productos", value: products.length, icon: BoxIcon, to: "/admin/productos" },
    { label: "Colecciones", value: categories.length, icon: LayersIcon, to: "/admin/categorias" },
    { label: "Pedidos pendientes", value: pendingOrders, icon: CartIcon, to: "/admin/pedidos" },
  ];

  return (
    <div className="admin-dashboard container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-dashboard__title">Panel</h1>

      <div className="admin-dashboard__stats">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link to={to} key={label} className="admin-stat-card">
            <div className="admin-stat-card__icon">
              <Icon />
            </div>
            <span className="admin-stat-card__value">{value}</span>
            <span className="admin-stat-card__label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
