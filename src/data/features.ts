export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: "people" | "star" | "handshake" | "pin";
}

export const features: Feature[] = [
  {
    id: "especialistas",
    title: "Especialistas en padel",
    description: "Te atendemos jugadores que conocen el juego.",
    icon: "people",
  },
  {
    id: "niveles",
    title: "Para todos los niveles",
    description: "Desde tu primera pala hasta modelos de alto rendimiento.",
    icon: "star",
  },
  {
    id: "asesoria",
    title: "Asesoría Personalizada",
    description: "Cada recomendación se adapta a tu nivel.",
    icon: "handshake",
  },
  {
    id: "tienda",
    title: "Tienda física en Juárez",
    description: "Visítanos, prueba productos y recibe atención personalizada.",
    icon: "pin",
  },
];
