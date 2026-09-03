import logo from "../../assets/logo.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__inner container">
        <a href="/" className="header__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </a>

        <div className="header__actions">
          <button className="header__icon-btn" type="button" aria-label="Buscar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className="header__icon-btn" type="button" aria-label="Abrir menú">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
