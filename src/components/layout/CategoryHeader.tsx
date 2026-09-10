import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { categories } from "../../data/categories";
import { useCollapsibleHeight } from "../../hooks/useCollapsibleHeight";
import { useHeaderVisibility } from "../../hooks/useHeaderVisibility";
import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "../home/icons";
import TopBar from "./TopBar";
import "./CategoryHeader.css";

function CategoryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const location = useLocation();
  const isVisible = useHeaderVisibility();
  const { ref: dropdownContentRef, height: dropdownHeight } = useCollapsibleHeight<HTMLUListElement>(
    isMenuOpen,
    [expandedCategoryId],
  );

  const closeMenu = () => {
    setIsMenuOpen(false);
    setExpandedCategoryId(null);
  };

  return (
    <header
      className={`category-header site-header site-header--neon${
        isVisible ? "" : " site-header--hidden"
      }`}
    >
      <TopBar />

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

      <div className="category-header__dropdown" style={{ maxHeight: dropdownHeight }}>
        <ul ref={dropdownContentRef}>
          {categories.map((category) => {
            const isActive = Boolean(category.path) && category.path === location.pathname;
            const rowClassName = `category-header__link${isActive ? " category-header__link--active" : ""}`;
            const hasBrands = Boolean(category.brands?.length);
            const isExpanded = expandedCategoryId === category.id;

            return (
              <li key={category.id}>
                {hasBrands ? (
                  <button
                    type="button"
                    className={rowClassName}
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                  >
                    {category.name}
                    <ChevronRightIcon
                      className={`category-header__link-chevron${
                        isExpanded ? " category-header__link-chevron--open" : ""
                      }`}
                    />
                  </button>
                ) : category.path ? (
                  <Link to={category.path} className={rowClassName} onClick={closeMenu}>
                    {category.name}
                    <ChevronRightIcon />
                  </Link>
                ) : (
                  <button type="button" className={rowClassName} onClick={closeMenu}>
                    {category.name}
                    <ChevronRightIcon />
                  </button>
                )}

                {hasBrands && isExpanded && (
                  <ul className="category-header__submenu">
                    <li>
                      <Link to={category.path ?? "#"} className="category-header__submenu-link" onClick={closeMenu}>
                        Ver todas las {category.name.toLowerCase()}
                      </Link>
                    </li>
                    {category.brands?.map((brand) => (
                      <li key={brand}>
                        <Link
                          to={`${category.path ?? ""}?marca=${encodeURIComponent(brand)}`}
                          className="category-header__submenu-link"
                          onClick={closeMenu}
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
      </div>
    </header>
  );
}

export default CategoryHeader;
