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

export function applyProductFilter(products: Product[], filter: ActiveFilter | null): Product[] {
  if (!filter) return products;
  if (filter.type === "brand") return products.filter((product) => product.brand === filter.value);
  if (filter.type === "level") return products.filter((product) => product.level === filter.value);
  if (filter.type === "size") {
    return products.filter((product) => product.sizes?.includes(filter.value));
  }
  return products;
}
