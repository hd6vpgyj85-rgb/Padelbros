import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { RacketPlaceholderIcon } from "../components/home/icons";
import { formatPrice } from "../utils/format";
import { findDuplicateProducts } from "../utils/duplicateProducts";
import "./AdminProductsPage.css";

function AdminProductsPage() {
  const { products } = useProducts();
  const duplicateGroups = findDuplicateProducts(products);
  const duplicateIds = new Set(duplicateGroups.flatMap((group) => group.products.map((product) => product.id)));

  return (
    <div className="admin-products container">
      <div className="admin-products__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-products__title">Productos</h1>
        </div>
        <Link to="/admin/productos/nuevo" className="btn btn--primary admin-products__new">
          Nuevo producto
        </Link>
      </div>

      {duplicateGroups.length > 0 && (
        <div className="admin-products__duplicate-warning">
          <p className="admin-products__duplicate-title">
            {duplicateGroups.length === 1
              ? "Se encontró un posible producto duplicado"
              : `Se encontraron ${duplicateGroups.length} posibles productos duplicados`}
          </p>
          <ul className="admin-products__duplicate-list">
            {duplicateGroups.map((group) => (
              <li key={group.key}>
                <span className="admin-products__duplicate-name">{group.name}</span>
                <span className="admin-products__duplicate-count">({group.products.length})</span>
                {group.products.map((product, index) => (
                  <span key={product.id}>
                    {index > 0 && " · "}
                    <Link to={`/admin/productos/${product.id}`}>Ver</Link>
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {products.length === 0 ? (
        <p className="admin-products__empty">No hay productos todavía.</p>
      ) : (
        <div className="admin-products__grid">
          {products.map((product) => (
            <Link to={`/admin/productos/${product.id}`} key={product.id} className="admin-product-card">
              <div className="admin-product-card__media">
                {duplicateIds.has(product.id) ? (
                  <span className="admin-product-card__badge admin-product-card__badge--duplicate">DUPLICADO</span>
                ) : (
                  <span className="admin-product-card__badge">VISIBLE</span>
                )}
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="admin-product-card__photo" />
                ) : (
                  <RacketPlaceholderIcon className="admin-product-card__placeholder" />
                )}
              </div>
              <div className="admin-product-card__body">
                <h3 className="admin-product-card__name">{product.name}</h3>
                <p className="admin-product-card__price">
                  {formatPrice(product.price)}
                  {product.onSale && product.compareAtPrice && (
                    <span className="admin-product-card__compare">{formatPrice(product.compareAtPrice)}</span>
                  )}
                </p>
                <p className="admin-product-card__stock">Existencias: {product.stock}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
