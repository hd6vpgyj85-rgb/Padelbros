import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { categories } from "../../data/categories";
import { useCartCount } from "../../hooks/useCartCount";
import { CartIcon, CloseIcon, SearchIcon, UserIcon } from "../home/icons";
import "./MobileMenu.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const cartCount = useCartCount();
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let frameId: number;

    if (isOpen) {
      setShouldRender(true);
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => setIsActive(true));
      });
    } else {
      setIsActive(false);
    }

    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`mobile-menu${isActive ? " mobile-menu--active" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      onTransitionEnd={(event) => {
        if (!isOpen && event.target === event.currentTarget) setShouldRender(false);
      }}
    >
      <div className="mobile-menu__topbar container">
        <Link to="/" className="mobile-menu__logo" aria-label="Padelbros - inicio" onClick={onClose}>
          <img src={logo} alt="Padelbros" />
        </Link>

        <div className="mobile-menu__actions">
          <button className="mobile-menu__icon-btn" type="button" aria-label="Buscar">
            <SearchIcon />
          </button>
          <button className="mobile-menu__icon-btn" type="button" aria-label="Mi cuenta">
            <UserIcon />
          </button>
          <button className="mobile-menu__icon-btn mobile-menu__cart" type="button" aria-label="Carrito">
            <CartIcon />
            {cartCount > 0 && <span className="mobile-menu__badge">{cartCount}</span>}
          </button>
          <button
            className="mobile-menu__icon-btn mobile-menu__close"
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <nav className="mobile-menu__nav container">
        <ul className="mobile-menu__list">
          {categories.map((category, index) => (
            <li key={category.id} style={{ transitionDelay: `${0.04 * index}s` }}>
              {category.path ? (
                <Link className="mobile-menu__link" to={category.path} onClick={onClose}>
                  {category.name}
                </Link>
              ) : (
                <button className="mobile-menu__link" type="button" onClick={onClose}>
                  {category.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MobileMenu;
