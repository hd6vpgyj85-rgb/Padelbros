import type { Product } from "../types/product";

export interface DuplicateGroup {
  key: string;
  name: string;
  products: Product[];
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findDuplicateProducts(products: Product[]): DuplicateGroup[] {
  const groups = new Map<string, Product[]>();

  products.forEach((product) => {
    const key = normalizeName(product.name);
    if (!key) return;
    const group = groups.get(key);
    if (group) group.push(product);
    else groups.set(key, [product]);
  });

  return Array.from(groups.values())
    .filter((items) => items.length > 1)
    .map((items) => ({ key: normalizeName(items[0].name), name: items[0].name, products: items }));
}
