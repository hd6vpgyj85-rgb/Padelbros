import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultProducts } from "../data/products";
import type { Product } from "../types/product";

const STORAGE_KEY = "padelbros_products";

function readStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProducts;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultProducts;
    return parsed;
  } catch {
    return defaultProducts;
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProductsContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>(() => readStoredProducts());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Storage unavailable (private mode, quota exceeded, etc.) — edits just won't persist.
    }
  }, [products]);

  const addProduct = (product: Omit<Product, "id">): Product => {
    const baseSlug = slugify(product.name) || "producto";
    const existingIds = new Set(products.map((item) => item.id));
    let id = baseSlug;
    let suffix = 1;
    while (existingIds.has(id)) {
      suffix += 1;
      id = `${baseSlug}-${suffix}`;
    }
    const newProduct: Product = { ...product, id };
    setProducts((current) => [...current, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...updates } : product)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const resetToDefaults = () => setProducts(defaultProducts);

  const value: ProductsContextValue = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
}
