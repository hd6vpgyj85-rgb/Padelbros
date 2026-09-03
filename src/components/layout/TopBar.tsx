import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCartCount } from "../../hooks/useCartCount";
import { CartIcon, SearchIcon, UserIcon } from "../home/icons";
import "./TopBar.css";

function TopBar() {
  const cartCount = useCartCount();

  return (
    <div className="top-bar container">
      <Link to="/" className="top-bar__logo" aria-label="Padelbros - inicio">
        <img src={logo} alt="Padelbros" />
      </Link>

      <div className="top-bar__actions">
        <Link className="top-bar__icon-btn" to="/buscar" aria-label="Buscar">
          <SearchIcon />
        </Link>
        <button className="top-bar__icon-btn" type="button" aria-label="Mi cuenta">
          <UserIcon />
        </button>
        <Link className="top-bar__icon-btn" to="/carrito" aria-label="Carrito">
          <CartIcon />
          {cartCount > 0 && <span className="top-bar__badge">{cartCount}</span>}
        </Link>
      </div>
    </div>
  );
}

export default TopBar;
