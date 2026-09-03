import { useMemo, useState } from "react";
import { useReviews, type ReviewStatus } from "../context/ReviewsContext";
import { TrashIcon } from "../components/home/icons";
import ImageLightbox from "../components/common/ImageLightbox";
import "./AdminReviewsPage.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const statusOrder: Record<ReviewStatus, number> = {
  pendiente: 0,
  aprobada: 1,
  rechazada: 2,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminReviewsPage() {
  const { reviews, updateReviewStatus, deleteReview } = useReviews();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]),
    [reviews],
  );

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la reseña de "${name}"? Esta acción no se puede deshacer.`)) return;
    deleteReview(id);
  };

  return (
    <div className="admin-reviews container">
      <span className="eyebrow">Padelbros</span>
      <h1 className="admin-reviews__title">Reseñas</h1>

      {sortedReviews.length === 0 ? (
        <p className="admin-reviews__empty">Todavía no hay reseñas.</p>
      ) : (
        <ul className="admin-reviews__list">
          {sortedReviews.map((review) => (
            <li key={review.id} className="admin-review-card">
              <div className="admin-review-card__header">
                <span
                  className={`admin-review-card__status admin-review-card__status--${review.status}`}
                >
                  {review.status}
                </span>
                <span className="admin-review-card__date">{formatDate(review.createdAt)}</span>
              </div>

              <div className="admin-review-card__stars" aria-hidden="true">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              {review.image && (
                <button
                  type="button"
                  className="admin-review-card__photo"
                  onClick={() => setLightboxImage(review.image ?? null)}
                  aria-label={`Ver foto de la reseña de ${review.name}`}
                >
                  <img src={review.image} alt="" />
                </button>
              )}

              <p className="admin-review-card__quote">“{review.quote}”</p>

              <p className="admin-review-card__author">
                {review.name}
                {review.level && <span> · {levelLabels[review.level]}</span>}
              </p>

              <div className="admin-review-card__actions">
                {review.status !== "aprobada" && (
                  <button
                    type="button"
                    className="admin-review-card__btn admin-review-card__btn--approve"
                    onClick={() => updateReviewStatus(review.id, "aprobada")}
                  >
                    Aprobar
                  </button>
                )}
                {review.status !== "rechazada" && (
                  <button
                    type="button"
                    className="admin-review-card__btn admin-review-card__btn--reject"
                    onClick={() => updateReviewStatus(review.id, "rechazada")}
                  >
                    Rechazar
                  </button>
                )}
                <button
                  type="button"
                  className="admin-review-card__btn admin-review-card__btn--delete"
                  onClick={() => handleDelete(review.id, review.name)}
                  aria-label={`Eliminar reseña de ${review.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {lightboxImage && (
        <ImageLightbox images={[lightboxImage]} onClose={() => setLightboxImage(null)} />
      )}
    </div>
  );
}

export default AdminReviewsPage;
