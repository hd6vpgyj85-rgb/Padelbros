import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useHeaderVisibility } from "../../hooks/useHeaderVisibility";
import { HamburgerIcon, SearchIcon } from "../home/icons";
import MobileMenu from "./MobileMenu";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isVisible = useHeaderVisibility();

  return (
    <header className={`header site-header${isVisible ? "" : " site-header--hidden"}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </Link>

        <div className="header__actions">
          <Link className="header__icon-btn" to="/buscar" aria-label="Buscar">
            <SearchIcon />
          </Link>
          <button
            className="header__icon-btn"
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
