import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import type { PlayerLevel, ProductCategory } from "../types/product";
import { resizeImageToDataUrl } from "../utils/imageResize";
import { RacketPlaceholderIcon, TrashIcon } from "../components/home/icons";
import { CameraIcon } from "./icons";
import "./AdminProductFormPage.css";

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "palas", label: "Palas" },
  { value: "mochilas", label: "Mochilas" },
  { value: "tenis", label: "Tenis" },
  { value: "accesorios", label: "Accesorios" },
  { value: "ropa", label: "Ropa" },
];

const levelOptions: { value: PlayerLevel; label: string }[] = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

interface FormState {
  name: string;
  price: string;
  compareAtPrice: string;
  onSale: boolean;
  category: ProductCategory;
  level: PlayerLevel | "";
  brand: string;
  stock: string;
  vendor: string;
  sizes: string;
  description: string;
  image: string;
}

function emptyForm(): FormState {
  return {
    name: "",
    price: "",
    compareAtPrice: "",
    onSale: false,
    category: "palas",
    level: "",
    brand: "",
    stock: "0",
    vendor: "",
    sizes: "",
    description: "",
    image: "",
  };
}

function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id) && id !== "nuevo";
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const existingProduct = isEditing ? products.find((product) => product.id === id) : undefined;

  const [form, setForm] = useState<FormState>(() => {
    if (!existingProduct) return emptyForm();
    return {
      name: existingProduct.name,
      price: String(existingProduct.price),
      compareAtPrice: existingProduct.compareAtPrice ? String(existingProduct.compareAtPrice) : "",
      onSale: Boolean(existingProduct.onSale),
      category: existingProduct.category,
      level: existingProduct.level ?? "",
      brand: existingProduct.brand,
      stock: String(existingProduct.stock),
      vendor: existingProduct.vendor ?? "",
      sizes: existingProduct.sizes?.join(", ") ?? "",
      description: existingProduct.description ?? "",
      image: existingProduct.image ?? "",
    };
  });
  const [imageError, setImageError] = useState("");

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      updateField("image", dataUrl);
      setImageError("");
    } catch {
      setImageError("No se pudo cargar la imagen. Intenta con otra foto.");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price) || 0,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      onSale: form.onSale,
      category: form.category,
      level: form.level || undefined,
      brand: form.brand.trim(),
      stock: Number(form.stock) || 0,
      vendor: form.vendor.trim() || undefined,
      sizes: form.sizes
        ? form.sizes.split(",").map((size) => size.trim()).filter(Boolean)
        : undefined,
      description: form.description.trim() || undefined,
      image: form.image || undefined,
    };

    if (isEditing && existingProduct) {
      updateProduct(existingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    navigate("/admin/productos");
  };

  const handleDelete = () => {
    if (!existingProduct) return;
    if (!window.confirm(`¿Eliminar "${existingProduct.name}"? Esta acción no se puede deshacer.`)) return;
    deleteProduct(existingProduct.id);
    navigate("/admin/productos");
  };

  if (isEditing && !existingProduct) {
    return <Navigate to="/admin/productos" replace />;
  }

  return (
    <div className="admin-product-form container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-product-form__title">{isEditing ? "Editar producto" : "Nuevo producto"}</h1>

      <form onSubmit={handleSubmit}>
        <label className="admin-product-form__image-picker">
          {form.image ? (
            <img src={form.image} alt="Vista previa" />
          ) : (
            <div className="admin-product-form__image-placeholder">
              <RacketPlaceholderIcon />
            </div>
          )}
          <span className="admin-product-form__image-btn">
            <CameraIcon />
            {form.image ? "Cambiar foto" : "Agregar foto"}
          </span>
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
        {imageError && <p className="admin-product-form__error">{imageError}</p>}

        <label className="admin-field">
          <span>Nombre *</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Precio *</span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Precio antes (oferta)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.compareAtPrice}
              onChange={(event) => updateField("compareAtPrice", event.target.value)}
            />
          </label>
        </div>

        <label className="admin-field admin-field--checkbox">
          <input
            type="checkbox"
            checked={form.onSale}
            onChange={(event) => updateField("onSale", event.target.checked)}
          />
          <span>Producto en oferta</span>
        </label>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Categoría *</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value as ProductCategory)}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Nivel</span>
            <select value={form.level} onChange={(event) => updateField("level", event.target.value as PlayerLevel | "")}>
              <option value="">Sin nivel</option>
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-field-row">
          <label className="admin-field">
            <span>Marca *</span>
            <input
              type="text"
              required
              value={form.brand}
              onChange={(event) => updateField("brand", event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Existencias *</span>
            <input
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(event) => updateField("stock", event.target.value)}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Proveedor (opcional)</span>
          <input
            type="text"
            value={form.vendor}
            onChange={(event) => updateField("vendor", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Tallas (separadas por coma, opcional)</span>
          <input
            type="text"
            placeholder="S, M, L, XL"
            value={form.sizes}
            onChange={(event) => updateField("sizes", event.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Descripción (opcional)</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <button type="submit" className="btn btn--primary admin-product-form__submit">
          {isEditing ? "Guardar cambios" : "Crear producto"}
        </button>

        {isEditing && (
          <button type="button" className="admin-product-form__delete" onClick={handleDelete}>
            <TrashIcon />
            Eliminar producto
          </button>
        )}
      </form>
    </div>
  );
}

export default AdminProductFormPage;
