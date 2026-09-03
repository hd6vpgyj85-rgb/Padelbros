import type { PlayerLevel } from "../types/product";

export interface Testimonial {
  id: string;
  name: string;
  level: PlayerLevel;
  rating: number;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "mariana-c",
    name: "Mariana C.",
    level: "principiante",
    rating: 5,
    quote:
      "Me atendieron súper bien, con ellos compré mi primera pala, tienen muchas opciones.",
  },
  {
    id: "matteo-fisz",
    name: "Matteo Fisz",
    level: "intermedio",
    rating: 5,
    quote:
      "Súper buena atención, muy amables, todavía mejores precios y buena localización.",
  },
  {
    id: "santiago-monte",
    name: "Santiago Monte",
    level: "avanzado",
    rating: 5,
    quote:
      "Muy buen servicio, los mejores precios y mucha variedad en producto. 10/10 la mejor de padel!",
  },
];
