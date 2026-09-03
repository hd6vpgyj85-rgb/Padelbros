import type { PlayerLevel, Product, ProductCategory } from "../types/product";
import type { ActiveFilter } from "../components/category/ProductFilters";

export function getProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function getOnSaleProducts(products: Product[]): Product[] {
  return products.filter((product) => product.onSale);
}

export function getAvailableBrands(products: Product[]): string[] {
  const brands = new Set<string>();
  products.forEach((product) => {
    if (product.stock > 0) brands.add(product.brand);
  });
  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

const LEVEL_ORDER: PlayerLevel[] = ["principiante", "intermedio", "avanzado"];

export function getAvailableLevels(products: Product[]): PlayerLevel[] {
  const levels = new Set<PlayerLevel>();
  products.forEach((product) => {
    if (product.stock > 0 && product.level) levels.add(product.level);
  });
  return LEVEL_ORDER.filter((level) => levels.has(level));
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export function getAvailableSizes(products: Product[]): string[] {
  const sizes = new Set<string>();
  products.forEach((product) => {
    if (product.stock > 0) product.sizes?.forEach((size) => sizes.add(size));
  });
  return SIZE_ORDER.filter((size) => sizes.has(size));
}

export interface PriceBucket {
  value: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BUCKETS: PriceBucket[] = [
  { value: "0-2000", label: "Menos de $2,000", min: 0, max: 2000 },
  { value: "2000-4000", label: "$2,000 – $4,000", min: 2000, max: 4000 },
  { value: "4000-6000", label: "$4,000 – $6,000", min: 4000, max: 6000 },
  { value: "6000-Infinity", label: "Más de $6,000", min: 6000, max: Infinity },
];

export function getAvailablePriceBuckets(products: Product[]): string[] {
  return PRICE_BUCKETS.filter((bucket) =>
    products.some((product) => product.stock > 0 && product.price >= bucket.min && product.price < bucket.max),
  ).map((bucket) => bucket.value);
}

export function applyProductFilter(products: Product[], filter: ActiveFilter | null): Product[] {
  if (!filter) return products;
  if (filter.type === "brand") return products.filter((product) => product.brand === filter.value);
  if (filter.type === "level") return products.filter((product) => product.level === filter.value);
  if (filter.type === "size") {
    return products.filter((product) => product.sizes?.includes(filter.value));
  }
  if (filter.type === "price") {
    const bucket = PRICE_BUCKETS.find((item) => item.value === filter.value);
    if (!bucket) return products;
    return products.filter((product) => product.price >= bucket.min && product.price < bucket.max);
  }
  return products;
}

export function searchProducts(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) || product.brand.toLowerCase().includes(normalized),
  );
}
