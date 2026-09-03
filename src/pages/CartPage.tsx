import { Link } from "react-router-dom";
import Accordion from "../components/product/Accordion";
import RelatedProducts from "../components/product/RelatedProducts";
import CategoryFooter from "../components/category/CategoryFooter";
import { useCart } from "../context/CartContext";
import { MinusIcon, PlusIcon, RacketPlaceholderIcon, TrashIcon } from "../components/home/icons";
import { formatPrice } from "../utils/format";
import "./CartPage.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

function CartPage() {
  const { lines, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page__title">
          Carrito <span className="cart-page__count">{totalItems}</span>
        </h1>

        {lines.length === 0 ? (
          <div className="cart-page__empty">
            <p>Tu carrito está vacío por el momento.</p>
            <Link to="/palas" className="btn btn--primary">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-page__list">
              {lines.map(({ product, quantity }) => (
                <li className="cart-item" key={product.id}>
                  <Link to={`/producto/${product.id}`} className="cart-item__media">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="cart-item__photo" />
                    ) : (
                      <RacketPlaceholderIcon />
                    )}
                  </Link>

                  <div className="cart-item__body">
                    <div className="cart-item__top">
                      <Link to={`/producto/${product.id}`} className="cart-item__name">
                        {product.name}
                      </Link>
                      <p className="cart-item__price">{formatPrice(product.price * quantity)}</p>
                    </div>

                    {product.level && (
                      <p className="cart-item__level">{levelLabels[product.level]}</p>
                    )}

                    <div className="cart-item__controls">
                      <div className="cart-item__stepper">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Restar cantidad"
                        >
                          <MinusIcon />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Sumar cantidad"
                          disabled={quantity >= product.stock}
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      {quantity >= product.stock && (
                        <span className="cart-item__stock-note">Solo quedan {product.stock}</span>
                      )}

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Quitar ${product.name} del carrito`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Accordion title="Cupón de descuento">
              <p>Podrás ingresar tu código de descuento en el siguiente paso, antes de confirmar tu pedido.</p>
            </Accordion>

            <div className="cart-page__summary">
              <div className="cart-page__summary-row">
                <span>Total estimado</span>
                <span className="cart-page__summary-total">{formatPrice(totalPrice)}</span>
              </div>
              <p className="cart-page__summary-note">
                Impuestos y envío se calculan en el checkout.
              </p>
            </div>

            <Link to="/checkout" className="cart-page__checkout-btn">
              Continuar con el pedido
            </Link>
          </>
        )}
      </div>

      <section className="cart-page__upsell">
        <div className="container cart-page__upsell-header">
          <h2>También te puede interesar</h2>
          <Link to="/buscar">Ver todo</Link>
        </div>
        <div className="container">
          <RelatedProducts count={4} variant="light" />
        </div>
      </section>

      <CategoryFooter />
    </div>
  );
}

export default CartPage;
