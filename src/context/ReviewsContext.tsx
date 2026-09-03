import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { PlayerLevel } from "../types/product";

export type ReviewStatus = "pendiente" | "aprobada" | "rechazada";

export interface Review {
  id: string;
  name: string;
  level?: PlayerLevel;
  rating: number;
  quote: string;
  image?: string;
  status: ReviewStatus;
  createdAt: string;
}

interface ReviewRow {
  id: string;
  name: string;
  level: PlayerLevel | null;
  rating: number;
  quote: string;
  image: string | null;
  status: ReviewStatus;
  created_at: string;
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    level: row.level ?? undefined,
    rating: row.rating,
    quote: row.quote,
    image: row.image ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

interface ReviewsContextValue {
  reviews: Review[];
  isLoading: boolean;
  addReview: (review: { name: string; level?: PlayerLevel; rating: number; quote: string; image?: string }) => Promise<void>;
  updateReviewStatus: (id: string, status: ReviewStatus) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error("No se pudieron cargar las reseñas", error);
      } else {
        setReviews((data as ReviewRow[]).map(rowToReview));
      }
      setIsLoading(false);
    };

    fetchReviews();

    // Un visitante anónimo solo ve reseñas aprobadas; el admin ve todas.
    // Al iniciar/cerrar sesión hay que volver a pedirlas.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchReviews();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const addReview: ReviewsContextValue["addReview"] = async (review) => {
    const { error } = await supabase.from("reviews").insert({
      name: review.name,
      level: review.level ?? null,
      rating: review.rating,
      quote: review.quote,
      image: review.image ?? null,
    });

    if (error) throw error;
  };

  const updateReviewStatus = async (id: string, status: ReviewStatus) => {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) throw error;
    setReviews((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
    setReviews((current) => current.filter((review) => review.id !== id));
  };

  const value: ReviewsContextValue = { reviews, isLoading, addReview, updateReviewStatus, deleteReview };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used within a ReviewsProvider");
  return context;
}
