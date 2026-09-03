import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Accordion from "../components/product/Accordion";
import RelatedProducts from "../components/product/RelatedProducts";
import CategoryFooter from "../components/category/CategoryFooter";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { categories } from "../data/categories";
import {
  CartIcon,
  HeartIcon,
  LayersIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  RacketPlaceholderIcon,
  RibbonIcon,
} from "../components/home/icons";
import { formatPrice } from "../utils/format";
import { getProductDescription } from "../utils/productCopy";
import "./ProductDetailPage.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const trustItems = [
  { Icon: HeartIcon, label: "Hecho con cuidado" },
  { Icon: RibbonIcon, label: "Excelente relación calidad-precio" },
  { Icon: LeafIcon, label: "Diseño elegante" },
  { Icon: LayersIcon, label: "Materiales de calidad" },
];

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find((candidate) => candidate.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return <Navigate to="/" replace />;

  const isOutOfStock = product.stock === 0;
  const categoryName = categories.find((category) => category.id === product.category)?.name ?? product.category;

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="product-detail">
      <div className="container product-detail__layout">
        <div className="product-detail__media">
          {isOutOfStock && <span className="product-detail__badge">Agotado</span>}
          {product.image ? (
            <img src={product.image} alt={product.name} className="product-detail__photo" />
          ) : (
            <RacketPlaceholderIcon className="product-detail__placeholder" />
          )}
        </div>

        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>

          {product.level && (
            <div className="product-detail__level">
              <span className="product-detail__level-label">Nivel</span>
              <span>{levelLabels[product.level]}</span>
            </div>
          )}

          <div className="product-detail__actions">
            <div className="product-detail__stepper">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Restar cantidad"
              >
                <MinusIcon />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Sumar cantidad">
                <PlusIcon />
              </button>
            </div>

            <button
              type="button"
              className="product-detail__add-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <CartIcon />
              {isOutOfStock ? "Agotado" : justAdded ? "Agregado ✓" : "Agregar al carrito"}
            </button>
          </div>

          <p className="product-detail__description">
            {product.description ?? getProductDescription(product)}
          </p>

          <ul className="product-detail__trust">
            {trustItems.map(({ Icon, label }) => (
              <li key={label}>
                <Icon />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <Accordion title="Detalles">
            <ul>
              <li>Marca: {product.brand}</li>
              <li>Categoría: {categoryName}</li>
              {product.level && <li>Nivel: {levelLabels[product.level]}</li>}
              <li>{isOutOfStock ? "Sin stock por el momento" : "Disponible para envío inmediato"}</li>
            </ul>
          </Accordion>

          <Accordion title="Envíos y devoluciones">
            <p>
              Realizamos envíos a toda la República Mexicana. El costo se calcula según tu
              ubicación y se confirma por WhatsApp antes de procesar tu pedido. Si tu producto
              presenta algún defecto de fábrica, cuentas con 15 días para solicitar cambio o
              devolución.
            </p>
          </Accordion>
        </div>
      </div>

      <section className="product-detail__related container">
        <span className="eyebrow">Especialistas en padel</span>
        <h2 className="section-title">Productos que también te pueden gustar</h2>
        <p className="product-detail__related-subtitle">
          Selección de productos de todas nuestras colecciones para ti.
        </p>

        <div className="product-detail__related-grid">
          <RelatedProducts excludeId={product.id} count={4} />
        </div>
      </section>

      <CategoryFooter />
    </div>
  );
}

export default ProductDetailPage;
