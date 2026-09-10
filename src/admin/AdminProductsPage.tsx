import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { categories } from "../data/categories";
import { RacketPlaceholderIcon } from "../components/home/icons";
import { formatPrice } from "../utils/format";
import { findDuplicateProducts } from "../utils/duplicateProducts";
import type { Product } from "../types/product";
import "./AdminProductsPage.css";

const DELETE_ALL_CONFIRM_TEXT = "delete products";
const LOW_STOCK_THRESHOLD = 3;

type StatusFilter = "todos" | "oferta" | "agotados" | "pocas";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "oferta", label: "En oferta" },
  { value: "agotados", label: "Agotados" },
  { value: "pocas", label: "Pocas unidades" },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function categoryLabel(categoryId: string): string {
  return categories.find((category) => category.id === categoryId)?.name ?? categoryId;
}

function matchesSearch(product: Product, query: string): boolean {
  if (!query) return true;
  const haystack = normalize(
    [product.name, product.brand, product.category, categoryLabel(product.category)].join(" "),
  );
  return haystack.includes(normalize(query));
}

function matchesStatus(product: Product, filter: StatusFilter): boolean {
  switch (filter) {
    case "oferta":
      return Boolean(product.onSale);
    case "agotados":
      return product.stock === 0;
    case "pocas":
      return product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
    default:
      return true;
  }
}

function AdminProductsPage() {
  const { products, deleteProduct } = useProducts();
  const duplicateGroups = findDuplicateProducts(products);
  const duplicateIds = new Set(duplicateGroups.flatMap((group) => group.products.map((product) => product.id)));

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesSearch(product, searchQuery) && matchesStatus(product, statusFilter)),
    [products, searchQuery, statusFilter],
  );

  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteAllProgress, setDeleteAllProgress] = useState({ done: 0, total: 0 });
  const [deleteAllErrors, setDeleteAllErrors] = useState<string[]>([]);

  const cancelDeleteAll = () => {
    setIsConfirmingDeleteAll(false);
    setDeleteAllConfirmText("");
    setDeleteAllErrors([]);
  };

  const handleDeleteAll = async () => {
    if (deleteAllConfirmText !== DELETE_ALL_CONFIRM_TEXT) return;

    setIsDeletingAll(true);
    setDeleteAllErrors([]);
    setDeleteAllProgress({ done: 0, total: products.length });

    const errors: string[] = [];
    for (const product of products) {
      try {
        await deleteProduct(product.id);
      } catch (error) {
        errors.push(`${product.name}: ${error instanceof Error ? error.message : "no se pudo eliminar"}`);
      }
      setDeleteAllProgress((current) => ({ ...current, done: current.done + 1 }));
    }

    setDeleteAllErrors(errors);
    setIsDeletingAll(false);
    if (errors.length === 0) {
      setIsConfirmingDeleteAll(false);
      setDeleteAllConfirmText("");
    }
  };

  return (
    <div className="admin-products container">
      <div className="admin-products__header">
        <div>
          <span className="eyebrow">Padelbros</span>
          <h1 className="admin-products__title">Productos</h1>
        </div>
        <div className="admin-products__actions">
          <Link to="/admin/productos/importar" className="btn btn--outline admin-products__import">
            Importar de Shopify
          </Link>
          <Link to="/admin/productos/nuevo" className="btn btn--primary admin-products__new">
            Nuevo producto
          </Link>
        </div>
      </div>

      {products.length > 0 && (
        <div className="admin-products__search-bar">
          <input
            type="search"
            className="admin-products__search-input"
            placeholder="Buscar por nombre, marca o categoría..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <div className="admin-products__filters">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`admin-products__filter${statusFilter === filter.value ? " admin-products__filter--active" : ""}`}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && !isConfirmingDeleteAll && (
        <button
          type="button"
          className="admin-products__delete-all-trigger"
          onClick={() => setIsConfirmingDeleteAll(true)}
        >
          Eliminar todos los productos
        </button>
      )}

      {isConfirmingDeleteAll && (
        <div className="admin-products__delete-all">
          <p className="admin-products__delete-all-title">
            ¿Eliminar los {products.length} productos del catálogo?
          </p>
          <p className="admin-products__delete-all-text">
            Esta acción no se puede deshacer. Para confirmar, escribe exactamente{" "}
            <code>{DELETE_ALL_CONFIRM_TEXT}</code> abajo.
          </p>

          <input
            type="text"
            className="admin-products__delete-all-input"
            value={deleteAllConfirmText}
            onChange={(event) => setDeleteAllConfirmText(event.target.value)}
            placeholder={DELETE_ALL_CONFIRM_TEXT}
            disabled={isDeletingAll}
            autoFocus
          />

          <div className="admin-products__delete-all-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={cancelDeleteAll}
              disabled={isDeletingAll}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="admin-products__delete-all-confirm"
              onClick={handleDeleteAll}
              disabled={deleteAllConfirmText !== DELETE_ALL_CONFIRM_TEXT || isDeletingAll}
            >
              {isDeletingAll
                ? `Eliminando ${deleteAllProgress.done}/${deleteAllProgress.total}...`
                : "Eliminar todo"}
            </button>
          </div>

          {deleteAllErrors.length > 0 && (
            <div className="admin-products__delete-all-errors">
              <p>No se pudieron eliminar {deleteAllErrors.length} producto(s):</p>
              <ul>
                {deleteAllErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
      ) : filteredProducts.length === 0 ? (
        <p className="admin-products__empty">No hay productos que coincidan con la búsqueda o el filtro.</p>
      ) : (
        <div className="admin-products__grid">
          {filteredProducts.map((product) => (
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
