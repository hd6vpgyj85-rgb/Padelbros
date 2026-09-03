import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { BoxIcon, GridIcon, LogoutIcon, TicketIcon } from "./icons";
import { CartIcon, LayersIcon, StarBadgeIcon } from "../components/home/icons";
import "./AdminLayout.css";

const tabs = [
  { to: "/admin", label: "Panel", icon: GridIcon, end: true },
  { to: "/admin/productos", label: "Productos", icon: BoxIcon, end: false },
  { to: "/admin/categorias", label: "Categorías", icon: LayersIcon, end: false },
  { to: "/admin/pedidos", label: "Pedidos", icon: CartIcon, end: false },
  { to: "/admin/resenas", label: "Reseñas", icon: StarBadgeIcon, end: false },
  { to: "/admin/cupones", label: "Cupones", icon: TicketIcon, end: false },
];

function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <span className="admin-header__brand">Padelbros Admin</span>
        <button type="button" className="admin-header__logout" onClick={logout} aria-label="Cerrar sesión">
          <LogoutIcon />
        </button>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>

      <nav className="admin-tabbar">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `admin-tabbar__item${isActive ? " admin-tabbar__item--active" : ""}`}
          >
            <Icon className="admin-tabbar__icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AdminLayout;
