import type { PlayerLevel, Product, ProductCategory } from "../types/product";

const levelPhrase: Record<PlayerLevel, string> = {
  principiante: "ideal para dar tus primeros pasos en la cancha",
  intermedio: "pensada para jugadores que ya dominan lo básico y buscan subir su nivel",
  avanzado: "diseñada para jugadores exigentes que buscan el máximo rendimiento",
};

const categoryPhrase: Record<ProductCategory, string> = {
  palas: "Su balance y estructura ofrecen un equilibrio entre potencia y control en cada golpe.",
  mochilas: "Su diseño resistente y espacioso te permite cargar tu equipo con estilo y organización.",
  ropa: "Confeccionada con materiales transpirables que te acompañan en cada punto sin perder comodidad.",
  accesorios: "Un complemento pensado para cuidar tu equipo y mejorar tu experiencia en cada partido.",
  tenis: "Ofrecen agarre y estabilidad para moverte con seguridad en cualquier superficie.",
};

export function getProductDescription(product: Product): string {
  const levelText = product.level ? levelPhrase[product.level] : "pensada para acompañar tu juego";
  const categoryText = categoryPhrase[product.category];

  return `${product.name} es ${levelText}. ${categoryText} Un producto ${product.brand} respaldado por Padelbros, con la calidad que tu juego merece.`;
}
