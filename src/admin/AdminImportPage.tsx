import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import type { PlayerLevel, ProductCategory } from "../types/product";
import { buildImportDrafts, readShopifyFile, type ImportDraft } from "../utils/shopifyImport";
import { uploadImageFromUrl } from "../utils/imageResize";
import { formatPrice } from "../utils/format";
import "./AdminImportPage.css";

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "palas", label: "Palas" },
  { value: "mochilas", label: "Mochilas" },
  { value: "tenis", label: "Tenis" },
  { value: "accesorios", label: "Accesorios" },
  { value: "ropa", label: "Ropa" },
];

const levelOptions: { value: PlayerLevel | ""; label: string }[] = [
  { value: "", label: "Sin nivel" },
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

type RowStatus = "pending" | "uploading" | "done" | "error";

function AdminImportPage() {
  const { addProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [drafts, setDrafts] = useState<ImportDraft[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [parseError, setParseError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [rowStatus, setRowStatus] = useState<Record<string, RowStatus>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setParseError("");
    setIsParsing(true);
    try {
      const rows = await readShopifyFile(file);
      const built = buildImportDrafts(rows);
      if (built.length === 0) {
        setParseError("No se encontraron productos en el archivo.");
      }
      setDrafts(built);
      setSelected(new Set(built.map((draft) => draft.key)));
      setRowStatus({});
      setRowError({});
    } catch {
      setParseError("No se pudo leer el archivo. Verifica que sea un export de productos de Shopify (.csv o .zip).");
      setDrafts([]);
    } finally {
      setIsParsing(false);
    }
  };

  const toggleSelected = (key: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((current) => (current.size === drafts.length ? new Set() : new Set(drafts.map((d) => d.key))));
  };

  const updateDraft = <K extends keyof ImportDraft>(key: string, field: K, value: ImportDraft[K]) => {
    setDrafts((current) => current.map((draft) => (draft.key === key ? { ...draft, [field]: value } : draft)));
  };

  const handleImport = async () => {
    const toImport = drafts.filter((draft) => selected.has(draft.key));
    if (toImport.length === 0) return;

    setIsImporting(true);
    for (const draft of toImport) {
      setRowStatus((current) => ({ ...current, [draft.key]: "uploading" }));
      try {
        const images = await Promise.all(
          draft.images.map(async (url) => {
            try {
              return await uploadImageFromUrl(url, "product-images");
            } catch {
              return url;
            }
          }),
        );

        await addProduct({
          name: draft.name,
          price: draft.price,
          compareAtPrice: draft.compareAtPrice,
          onSale: draft.onSale,
          category: draft.category,
          level: draft.level || undefined,
          brand: draft.brand || "Sin marca",
          stock: draft.stock,
          sizes: draft.sizes.length > 0 ? draft.sizes : undefined,
          description: draft.description || undefined,
          images,
          homeImageFit: "cover",
        });

        setRowStatus((current) => ({ ...current, [draft.key]: "done" }));
      } catch (error) {
        setRowStatus((current) => ({ ...current, [draft.key]: "error" }));
        setRowError((current) => ({
          ...current,
          [draft.key]: error instanceof Error ? error.message : "No se pudo importar este producto.",
        }));
      }
    }
    setIsImporting(false);
  };

  const doneCount = Object.values(rowStatus).filter((status) => status === "done").length;
  const errorCount = Object.values(rowStatus).filter((status) => status === "error").length;
  const hasRun = Object.keys(rowStatus).length > 0;

  return (
    <div className="admin-import container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-import__title">Importar de Shopify</h1>
      <p className="admin-import__hint">
        Sube el archivo que exporta Shopify en <strong>Productos → Exportar</strong>: puede ser el .zip completo
        (con imágenes) o solo el products_export.csv.
      </p>

      <div className="admin-import__upload">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,.csv"
          onChange={handleFileChange}
          hidden
          id="shopify-file"
        />
        <label htmlFor="shopify-file" className="btn btn--primary admin-import__upload-btn">
          {isParsing ? "Leyendo archivo..." : "Elegir archivo"}
        </label>
        {parseError && <p className="admin-import__error">{parseError}</p>}
      </div>

      {drafts.length > 0 && (
        <>
          <div className="admin-import__summary">
            <label className="admin-import__select-all">
              <input
                type="checkbox"
                checked={selected.size === drafts.length}
                onChange={toggleAll}
              />
              <span>
                {selected.size} de {drafts.length} productos seleccionados
              </span>
            </label>

            <button
              type="button"
              className="btn btn--primary"
              onClick={handleImport}
              disabled={isImporting || selected.size === 0}
            >
              {isImporting ? "Importando..." : `Importar ${selected.size} producto${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>

          {hasRun && (
            <p className="admin-import__progress">
              {doneCount} importados{errorCount > 0 ? `, ${errorCount} con error` : ""} de {drafts.length}
            </p>
          )}

          <ul className="admin-import__list">
            {drafts.map((draft) => {
              const status = rowStatus[draft.key];
              return (
                <li className="admin-import-row" key={draft.key}>
                  <input
                    type="checkbox"
                    className="admin-import-row__check"
                    checked={selected.has(draft.key)}
                    onChange={() => toggleSelected(draft.key)}
                    disabled={isImporting}
                  />

                  <div className="admin-import-row__media">
                    {draft.images[0] ? (
                      <img src={draft.images[0]} alt={draft.name} />
                    ) : (
                      <div className="admin-import-row__no-image">Sin imagen</div>
                    )}
                  </div>

                  <div className="admin-import-row__body">
                    <p className="admin-import-row__name">{draft.name}</p>
                    <p className="admin-import-row__meta">
                      {formatPrice(draft.price)}
                      {draft.compareAtPrice && (
                        <span className="admin-import-row__compare">{formatPrice(draft.compareAtPrice)}</span>
                      )}
                      {" · "}
                      Existencias: {draft.stock}
                      {draft.sizes.length > 0 && ` · Tallas: ${draft.sizes.join(", ")}`}
                      {draft.images.length > 0 && ` · ${draft.images.length} imagen${draft.images.length === 1 ? "" : "es"}`}
                    </p>

                    <div className="admin-import-row__fields">
                      <label className="admin-import-row__field">
                        <span>Categoría</span>
                        <select
                          value={draft.category}
                          disabled={isImporting}
                          onChange={(event) => updateDraft(draft.key, "category", event.target.value as ProductCategory)}
                        >
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="admin-import-row__field">
                        <span>Marca</span>
                        <input
                          type="text"
                          value={draft.brand}
                          disabled={isImporting}
                          onChange={(event) => updateDraft(draft.key, "brand", event.target.value)}
                        />
                      </label>

                      <label className="admin-import-row__field">
                        <span>Nivel</span>
                        <select
                          value={draft.level}
                          disabled={isImporting}
                          onChange={(event) => updateDraft(draft.key, "level", event.target.value as PlayerLevel | "")}
                        >
                          {levelOptions.map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {status === "uploading" && <p className="admin-import-row__status">Importando...</p>}
                    {status === "done" && <p className="admin-import-row__status admin-import-row__status--ok">Importado ✓</p>}
                    {status === "error" && (
                      <p className="admin-import-row__status admin-import-row__status--error">
                        {rowError[draft.key] ?? "Error al importar"}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Link to="/admin/productos" className="admin-import__back">
        Volver a Productos
      </Link>
    </div>
  );
}

export default AdminImportPage;
