export interface LevelInfo {
  number: string;
  name: string;
  description: string;
}

export const levels: LevelInfo[] = [
  {
    number: "01",
    name: "Principiante",
    description: "Inicia con la pala correcta. Ligera, balanceada y perdona errores.",
  },
  {
    number: "02",
    name: "Intermedio",
    description: "Sube tu juego. Más potencia, más control, mismo confort.",
  },
  {
    number: "03",
    name: "Avanzado",
    description: "Equipo de competencia. Carbono, potencia y peso.",
  },
];

export interface WhyUsItem {
  number: string;
  description: string;
}

export const whyUsItems: WhyUsItem[] = [
  { number: "01", description: "Jugadores asesorando jugadores." },
  { number: "02", description: "Equipo elegido para tu juego." },
  { number: "03", description: "Atención que marca la diferencia." },
];
