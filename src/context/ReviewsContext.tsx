import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { testimonials } from "../data/testimonials";
import type { PlayerLevel } from "../types/product";

export type ReviewStatus = "pendiente" | "aprobada" | "rechazada";

export interface Review {
  id: string;
  name: string;
  level?: PlayerLevel;
  rating: number;
  quote: string;
  status: ReviewStatus;
  createdAt: string;
}

const STORAGE_KEY = "padelbros_reviews";

function seedReviews(): Review[] {
  return testimonials.map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    level: testimonial.level,
    rating: testimonial.rating,
    quote: testimonial.quote,
    status: "aprobada",
    createdAt: new Date(0).toISOString(),
  }));
}

function readStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedReviews();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedReviews();
    return parsed;
  } catch {
    return seedReviews();
  }
}

interface ReviewsContextValue {
  reviews: Review[];
  addReview: (review: { name: string; level?: PlayerLevel; rating: number; quote: string }) => void;
  updateReviewStatus: (id: string, status: ReviewStatus) => void;
  deleteReview: (id: string) => void;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() => readStoredReviews());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Storage unavailable — reviews just won't persist across reloads.
    }
  }, [reviews]);

  const addReview: ReviewsContextValue["addReview"] = (review) => {
    const newReview: Review = {
      ...review,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: "pendiente",
      createdAt: new Date().toISOString(),
    };
    setReviews((current) => [newReview, ...current]);
  };

  const updateReviewStatus = (id: string, status: ReviewStatus) => {
    setReviews((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));
  };

  const deleteReview = (id: string) => {
    setReviews((current) => current.filter((review) => review.id !== id));
  };

  const value: ReviewsContextValue = { reviews, addReview, updateReviewStatus, deleteReview };

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used within a ReviewsProvider");
  return context;
}
