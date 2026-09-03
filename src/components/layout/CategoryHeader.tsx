import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { categories } from "../../data/categories";
import { useCartCount } from "../../hooks/useCartCount";
import {
  CartIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
  SearchIcon,
  UserIcon,
} from "../home/icons";
import "./CategoryHeader.css";

function CategoryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = useCartCount();
  const location = useLocation();

  return (
    <header className="category-header">
      <div className="category-header__topbar container">
        <Link to="/" className="category-header__logo" aria-label="Padelbros - inicio">
          <img src={logo} alt="Padelbros" />
        </Link>

        <div className="category-header__actions">
          <button className="category-header__icon-btn" type="button" aria-label="Buscar">
            <SearchIcon />
          </button>
          <button className="category-header__icon-btn" type="button" aria-label="Mi cuenta">
            <UserIcon />
          </button>
          <button className="category-header__icon-btn" type="button" aria-label="Carrito">
            <CartIcon />
            {cartCount > 0 && <span className="category-header__badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="category-header__menu-toggle"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="category-header__menu-toggle-left">
          {isMenuOpen ? (
            <CloseIcon className="category-header__menu-icon" />
          ) : (
            <HamburgerIcon className="category-header__menu-icon" />
          )}
          Menú
        </span>
        <ChevronDownIcon
          className={`category-header__chevron${isMenuOpen ? " category-header__chevron--open" : ""}`}
        />
      </button>

      <div className={`category-header__dropdown${isMenuOpen ? " category-header__dropdown--open" : ""}`}>
        <ul>
          {categories.map((category) => {
            const isActive = Boolean(category.path) && category.path === location.pathname;
            const rowClassName = `category-header__link${isActive ? " category-header__link--active" : ""}`;

            return (
              <li key={category.id}>
                {category.path ? (
                  <Link to={category.path} className={rowClassName} onClick={() => setIsMenuOpen(false)}>
                    {category.name}
                    <ChevronRightIcon />
                  </Link>
                ) : (
                  <button type="button" className={rowClassName} onClick={() => setIsMenuOpen(false)}>
                    {category.name}
                    <ChevronRightIcon />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default CategoryHeader;
