import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { categories } from "../../data/categories";
import { useCartCount } from "../../hooks/useCartCount";
import { CartIcon, ChevronRightIcon, CloseIcon, SearchIcon, UserIcon } from "../home/icons";
import "./MobileMenu.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const cartCount = useCartCount();
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let frameId: number;

    if (isOpen) {
      setShouldRender(true);
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => setIsActive(true));
      });
    } else {
      setIsActive(false);
      setExpandedCategoryId(null);
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

  return createPortal(
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
          <Link className="mobile-menu__icon-btn" to="/buscar" aria-label="Buscar" onClick={onClose}>
            <SearchIcon />
          </Link>
          <Link
            className="mobile-menu__icon-btn"
            to="/admin"
            aria-label="Panel de administración"
            onClick={onClose}
          >
            <UserIcon />
          </Link>
          <Link
            className="mobile-menu__icon-btn mobile-menu__cart"
            to="/carrito"
            aria-label="Carrito"
            onClick={onClose}
          >
            <CartIcon />
            {cartCount > 0 && <span className="mobile-menu__badge">{cartCount}</span>}
          </Link>
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
          {categories.map((category, index) => {
            const hasBrands = Boolean(category.brands?.length);
            const isExpanded = expandedCategoryId === category.id;

            return (
              <li key={category.id} style={{ transitionDelay: `${0.04 * index}s` }}>
                {hasBrands ? (
                  <button
                    className="mobile-menu__link mobile-menu__link--expandable"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                  >
                    {category.name}
                    <ChevronRightIcon
                      className={`mobile-menu__link-chevron${isExpanded ? " mobile-menu__link-chevron--open" : ""}`}
                    />
                  </button>
                ) : category.path ? (
                  <Link className="mobile-menu__link" to={category.path} onClick={onClose}>
                    {category.name}
                  </Link>
                ) : (
                  <button className="mobile-menu__link" type="button" onClick={onClose}>
                    {category.name}
                  </button>
                )}

                {hasBrands && isExpanded && (
                  <ul className="mobile-menu__submenu">
                    <li>
                      <Link to={category.path ?? "#"} className="mobile-menu__submenu-link" onClick={onClose}>
                        Ver todas las {category.name.toLowerCase()}
                      </Link>
                    </li>
                    {category.brands?.map((brand) => (
                      <li key={brand}>
                        <Link
                          to={`${category.path ?? ""}?marca=${encodeURIComponent(brand)}`}
                          className="mobile-menu__submenu-link"
                          onClick={onClose}
                        >
                          {brand}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>,
    document.body,
  );
}

export default MobileMenu;
