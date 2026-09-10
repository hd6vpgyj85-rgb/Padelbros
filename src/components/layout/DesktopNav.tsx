import { Link, useLocation } from "react-router-dom";
import { categories } from "../../data/categories";
import "./DesktopNav.css";

function DesktopNav() {
  const location = useLocation();

  return (
    <nav className="desktop-nav" aria-label="Categorías">
      <ul>
        {categories.map((category) => {
          const hasBrands = Boolean(category.brands?.length);
          const isActive = Boolean(category.path) && category.path === location.pathname;

          return (
            <li className="desktop-nav__item" key={category.id}>
              {category.path ? (
                <Link
                  to={category.path}
                  className={`desktop-nav__link${isActive ? " desktop-nav__link--active" : ""}`}
                >
                  {category.name}
                </Link>
              ) : (
                <span className="desktop-nav__link">{category.name}</span>
              )}

              {hasBrands && (
                <div className="desktop-nav__dropdown">
                  <Link to={category.path ?? "#"} className="desktop-nav__dropdown-link">
                    Ver todas las {category.name.toLowerCase()}
                  </Link>
                  {category.brands?.map((brand) => (
                    <Link
                      key={brand}
                      to={`${category.path ?? ""}?marca=${encodeURIComponent(brand)}`}
                      className="desktop-nav__dropdown-link"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default DesktopNav;
