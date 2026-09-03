import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { categories } from "../../data/categories";
import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "../home/icons";
import TopBar from "./TopBar";
import "./CategoryHeader.css";

function CategoryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="category-header">
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
