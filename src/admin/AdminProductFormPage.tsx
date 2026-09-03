import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import type { ImageFit, PlayerLevel, Product, ProductCategory } from "../types/product";
import { uploadImage } from "../utils/imageResize";
import { TrashIcon } from "../components/home/icons";
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
  images: string[];
  homeImageFit: ImageFit;
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
    images: [],
    homeImageFit: "cover",
  };
}

function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id) && id !== "nuevo";
  const { products, isLoading: isLoadingProducts } = useProducts();

  // Products load asynchronously, so don't mount the form (and its
  // useState-initialized-once field values) until we actually know
  // whether an existing product is there to pre-fill it with.
  if (isLoadingProducts) return null;

  const existingProduct = isEditing ? products.find((product) => product.id === id) : undefined;

  if (isEditing && !existingProduct) {
    return <Navigate to="/admin/productos" replace />;
  }

  return <AdminProductForm key={existingProduct?.id ?? "new"} isEditing={isEditing} existingProduct={existingProduct} />;
}

interface AdminProductFormProps {
  isEditing: boolean;
  existingProduct?: Product;
}

function AdminProductForm({ isEditing, existingProduct }: AdminProductFormProps) {
  const navigate = useNavigate();
  const { addProduct, updateProduct, deleteProduct } = useProducts();

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
      images: existingProduct.images ?? [],
      homeImageFit: existingProduct.homeImageFit ?? "cover",
    };
  });
  const [imageError, setImageError] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file, "product-images")));
      setForm((current) => ({ ...current, images: [...current.images, ...urls] }));
      setImageError("");
    } catch {
      setImageError("No se pudo subir alguna imagen. Intenta con otra foto.");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (event: FormEvent) => {
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
      images: form.images.length > 0 ? form.images : undefined,
      homeImageFit: form.homeImageFit,
    };

    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (isEditing && existingProduct) {
        await updateProduct(existingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      navigate("/admin/productos");
    } catch {
      setSubmitError("No se pudo guardar el producto. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingProduct) return;
    if (!window.confirm(`¿Eliminar "${existingProduct.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(existingProduct.id);
      navigate("/admin/productos");
    } catch {
      setSubmitError("No se pudo eliminar el producto. Intenta de nuevo.");
    }
  };

  return (
    <div className="admin-product-form container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-product-form__title">{isEditing ? "Editar producto" : "Nuevo producto"}</h1>

      <form onSubmit={handleSubmit}>
        <div className="admin-product-form__images">
          {form.images.map((image, index) => (
            <div className="admin-product-form__image-tile" key={image.slice(0, 32) + index}>
              <img src={image} alt={`Foto ${index + 1}`} />
              {index === 0 && <span className="admin-product-form__image-cover">Portada</span>}
              <button
                type="button"
                className="admin-product-form__image-remove"
                onClick={() => handleRemoveImage(index)}
                aria-label={`Quitar foto ${index + 1}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}

          <label className="admin-product-form__image-add">
            <CameraIcon />
            <span>{isUploadingImages ? "Subiendo..." : "Agregar fotos"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              disabled={isUploadingImages}
              hidden
            />
          </label>
        </div>
        {imageError && <p className="admin-product-form__error">{imageError}</p>}

        {form.images.length > 0 && (
          <div className="admin-field">
            <span>Ajuste de la foto de portada en Inicio</span>
            <div className="admin-image-fit">
              <div className="admin-image-fit__preview">
                <img src={form.images[0]} alt="Vista previa en Inicio" style={{ objectFit: form.homeImageFit }} />
              </div>
              <div className="admin-image-fit__options">
                <button
                  type="button"
                  className={`admin-image-fit__option${form.homeImageFit === "cover" ? " admin-image-fit__option--active" : ""}`}
                  onClick={() => updateField("homeImageFit", "cover")}
                >
                  Llenar (recorta)
                </button>
                <button
                  type="button"
                  className={`admin-image-fit__option${form.homeImageFit === "contain" ? " admin-image-fit__option--active" : ""}`}
                  onClick={() => updateField("homeImageFit", "contain")}
                >
                  Ver completa
                </button>
              </div>
            </div>
          </div>
        )}

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

        {submitError && <p className="admin-product-form__error">{submitError}</p>}

        <button
          type="submit"
          className="btn btn--primary admin-product-form__submit"
          disabled={isSubmitting || isUploadingImages}
        >
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
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
