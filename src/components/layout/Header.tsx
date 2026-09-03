import { useState } from "react";
import logo from "../../assets/logo.png";
import { HamburgerIcon, SearchIcon } from "../home/icons";
import MobileMenu from "./MobileMenu";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="/" className="header__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </a>

        <div className="header__actions">
          <button className="header__icon-btn" type="button" aria-label="Buscar">
            <SearchIcon />
          </button>
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
