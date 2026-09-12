import { Link, NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { BoxIcon, ExternalLinkIcon, GridIcon, LogoutIcon, TicketIcon } from "./icons";
import { CartIcon, LayersIcon, PeopleIcon, StarBadgeIcon } from "../components/home/icons";
import "./AdminLayout.css";

const tabs = [
  { to: "/admin", label: "Panel", icon: GridIcon, end: true },
  { to: "/admin/productos", label: "Productos", icon: BoxIcon, end: false },
  { to: "/admin/categorias", label: "Categorías", icon: LayersIcon, end: false },
  { to: "/admin/pedidos", label: "Pedidos", icon: CartIcon, end: false },
];

const headerLinks = [
  { to: "/admin/clientes", label: "Clientes", icon: PeopleIcon },
  { to: "/admin/resenas", label: "Reseñas", icon: StarBadgeIcon },
  { to: "/admin/cupones", label: "Cupones", icon: TicketIcon },
];

function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <Link to="/admin" className="admin-header__brand">
          Padelbros
        </Link>
        <div className="admin-header__actions">
          {headerLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-header__link${isActive ? " admin-header__link--active" : ""}`
              }
              aria-label={label}
              title={label}
            >
              <Icon />
            </NavLink>
          ))}

          <span className="admin-header__divider" aria-hidden="true" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-header__view-site"
            aria-label="Ver página principal"
            title="Ver página principal"
          >
            <ExternalLinkIcon />
          </a>
          <button type="button" className="admin-header__logout" onClick={logout} aria-label="Cerrar sesión">
            <LogoutIcon />
          </button>
        </div>
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
