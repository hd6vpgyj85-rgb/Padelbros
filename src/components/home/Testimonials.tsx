import { useMemo, useState, type FormEvent } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useReviews } from "../../context/ReviewsContext";
import "./Testimonials.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const { reviews, addReview } = useReviews();

  const approvedReviews = useMemo(
    () => reviews.filter((review) => review.status === "aprobada"),
    [reviews],
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !quote.trim() || rating === 0) return;

    addReview({ name: name.trim(), rating, quote: quote.trim() });
    setName("");
    setRating(0);
    setQuote("");
    setSubmitted(true);
  };

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <span className="eyebrow">La comunidad habla</span>
        <h2 className="section-title">+500 jugadores nos recomiendan.</h2>

        {approvedReviews.length > 0 && (
          <div className="testimonials__grid">
            {approvedReviews.map((review, index) => (
              <article
                className={`testimonial-card reveal${isVisible ? " reveal--visible" : ""}`}
                key={review.id}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-card__stars" aria-hidden="true">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="testimonial-card__quote">“{review.quote}”</p>
                <p className="testimonial-card__author">
                  {review.name}
                  {review.level && (
                    <span className="testimonial-card__level">{levelLabels[review.level]}</span>
                  )}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="testimonials__cta">
          {submitted ? (
            <p className="testimonials__thanks">
              ¡Gracias por tu reseña! Se mostrará en cuanto el equipo la apruebe.
            </p>
          ) : isFormOpen ? (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="review-form__stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`review-form__star${value <= rating ? " review-form__star--active" : ""}`}
                    onClick={() => setRating(value)}
                    aria-label={`Calificar con ${value} estrellas`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="review-form__input"
                required
              />

              <textarea
                placeholder="Cuéntanos tu experiencia con Padelbros..."
                value={quote}
                onChange={(event) => setQuote(event.target.value)}
                className="review-form__textarea"
                rows={3}
                required
              />

              <div className="review-form__actions">
                <button type="submit" className="btn btn--primary">
                  Enviar reseña
                </button>
                <button type="button" className="btn btn--outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="btn btn--outline" onClick={() => setIsFormOpen(true)}>
              Escribe tu reseña
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.5l2.9 6.36 6.98.68-5.27 4.73 1.55 6.9L12 17.77l-6.16 3.4 1.55-6.9L2.12 9.54l6.98-.68L12 2.5z" />
    </svg>
  );
}

export default Testimonials;
