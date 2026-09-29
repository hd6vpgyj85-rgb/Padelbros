import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCartCount } from "../../hooks/useCartCount";
import { useProfileLink } from "../../hooks/useProfileLink";
import { CartIcon, SearchIcon, UserIcon } from "../home/icons";
import DesktopNav from "./DesktopNav";
import "./TopBar.css";

function TopBar() {
  const cartCount = useCartCount();
  const profileLink = useProfileLink();

  return (
    <div className="top-bar container">
      <Link to="/" className="top-bar__logo" aria-label="Padelbros - inicio">
        <img src={logo} alt="Padelbros" />
      </Link>

      <DesktopNav />

      <div className="top-bar__actions">
        <Link className="top-bar__icon-btn" to="/buscar" aria-label="Buscar">
          <SearchIcon />
        </Link>
        <Link className="top-bar__icon-btn" to={profileLink} aria-label="Mi cuenta">
          <UserIcon />
        </Link>
        <Link className="top-bar__icon-btn" to="/carrito" aria-label="Carrito">
          <CartIcon />
          {cartCount > 0 && (
            <span className="top-bar__badge" key={cartCount}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default TopBar;
