export type PlayerLevel = "principiante" | "intermedio" | "avanzado";

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  onSale?: boolean;
  level?: PlayerLevel;
  category?: string;
}
