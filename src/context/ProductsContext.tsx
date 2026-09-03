import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/product";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  on_sale: boolean;
  level: Product["level"] | null;
  category: Product["category"];
  brand: string;
  stock: number;
  vendor: string | null;
  sizes: string[] | null;
  description: string | null;
  images: string[] | null;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ?? undefined,
    onSale: row.on_sale,
    level: row.level ?? undefined,
    category: row.category,
    brand: row.brand,
    stock: row.stock,
    vendor: row.vendor ?? undefined,
    sizes: row.sizes ?? undefined,
    description: row.description ?? undefined,
    images: row.images ?? undefined,
  };
}

const FIELD_MAP: Record<keyof Omit<Product, "id">, string> = {
  name: "name",
  price: "price",
  compareAtPrice: "compare_at_price",
  onSale: "on_sale",
  level: "level",
  category: "category",
  brand: "brand",
  stock: "stock",
  vendor: "vendor",
  sizes: "sizes",
  description: "description",
  images: "images",
};

function productToRow(product: Partial<Omit<Product, "id">>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  (Object.keys(product) as (keyof Omit<Product, "id">)[]).forEach((key) => {
    if (product[key] === undefined) return;
    row[FIELD_MAP[key]] = product[key];
  });
  return row;
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
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("No se pudieron cargar los productos", error);
        } else {
          setProducts((data as ProductRow[]).map(rowToProduct));
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const baseSlug = slugify(product.name) || "producto";
    const existingIds = new Set(products.map((item) => item.id));
    let id = baseSlug;
    let suffix = 1;
    while (existingIds.has(id)) {
      suffix += 1;
      id = `${baseSlug}-${suffix}`;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({ id, ...productToRow(product) })
      .select()
      .single();

    if (error) throw error;
    setProducts((current) => [...current, rowToProduct(data as ProductRow)]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .update(productToRow(updates))
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setProducts((current) => current.map((p) => (p.id === id ? rowToProduct(data as ProductRow) : p)));
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const value: ProductsContextValue = { products, isLoading, addProduct, updateProduct, deleteProduct };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
}
