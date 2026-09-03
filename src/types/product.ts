export type PlayerLevel = "principiante" | "intermedio" | "avanzado";

export type ProductCategory = "palas" | "mochilas" | "tenis" | "accesorios" | "ropa";

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  onSale?: boolean;
  level?: PlayerLevel;
  category: ProductCategory;
  brand: string;
  stock: number;
  vendor?: string;
  sizes?: string[];
  description?: string;
  image?: string;
}
