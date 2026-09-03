export interface Category {
  id: string;
  name: string;
  path?: string;
}

export const categories: Category[] = [
  { id: "palas", name: "Palas", path: "/palas" },
  { id: "mochilas", name: "Mochilas" },
  { id: "tennis", name: "Tennis" },
  { id: "accesorios", name: "Accesorios" },
  { id: "ropa", name: "Ropa" },
  { id: "ofertas", name: "Ofertas" },
];
