import type { PlayerLevel, Product, ProductCategory } from "../types/product";

export function getProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
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
