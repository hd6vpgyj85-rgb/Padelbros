export interface Category {
  id: string;
  name: string;
  path?: string;
}

export const categories: Category[] = [
  { id: "palas", name: "Palas", path: "/palas" },
  { id: "mochilas", name: "Mochilas", path: "/mochilas" },
  { id: "tenis", name: "Tenis", path: "/tenis" },
  { id: "accesorios", name: "Accesorios", path: "/accesorios" },
  { id: "ropa", name: "Ropa", path: "/ropa" },
  { id: "ofertas", name: "Ofertas", path: "/ofertas" },
];
