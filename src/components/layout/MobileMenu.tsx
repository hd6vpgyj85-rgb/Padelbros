import { useEffect } from "react";
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

  if (!isOpen) return null;

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú">
      <div className="mobile-menu__topbar container">
        <a href="/" className="mobile-menu__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </a>

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
          {categories.map((category) => (
            <li key={category.id}>
              <button className="mobile-menu__link" type="button" onClick={onClose}>
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MobileMenu;
