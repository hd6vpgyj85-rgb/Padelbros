import { useCartCount } from "../../hooks/useCartCount";
import { CartIcon, SearchIcon, UserIcon } from "../home/icons";
import "./BottomTabBar.css";

function BottomTabBar() {
  const cartCount = useCartCount();

  return (
    <nav className="bottom-tab-bar" aria-label="Navegación rápida">
      <button className="bottom-tab-bar__item" type="button">
        <SearchIcon />
        <span>Buscar</span>
      </button>
      <button className="bottom-tab-bar__item" type="button">
        <UserIcon />
        <span>Cuenta</span>
      </button>
      <button className="bottom-tab-bar__item" type="button">
        <span className="bottom-tab-bar__icon-wrap">
          <CartIcon />
          {cartCount > 0 && <span className="bottom-tab-bar__badge">{cartCount}</span>}
        </span>
        <span>Carrito</span>
      </button>
    </nav>
  );
}

export default BottomTabBar;
