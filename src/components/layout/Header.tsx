import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useHeaderVisibility } from "../../hooks/useHeaderVisibility";
import { useCartCount } from "../../hooks/useCartCount";
import { CartIcon, HamburgerIcon, SearchIcon, UserIcon } from "../home/icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isVisible = useHeaderVisibility();
  const cartCount = useCartCount();

  return (
    <header className={`header site-header${isVisible ? "" : " site-header--hidden"}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </Link>

        <DesktopNav />

        <div className="header__actions">
          <Link className="header__icon-btn" to="/buscar" aria-label="Buscar">
            <SearchIcon />
          </Link>
          <Link className="header__icon-btn header__icon-btn--desktop" to="/admin" aria-label="Panel de administración">
            <UserIcon />
          </Link>
          <Link className="header__icon-btn header__icon-btn--desktop" to="/carrito" aria-label="Carrito">
            <CartIcon />
            {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
          </Link>
          <button
            className="header__icon-btn header__icon-btn--mobile-only"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}

export default Header;
