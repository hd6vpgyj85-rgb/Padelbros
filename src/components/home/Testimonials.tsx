import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useReviews } from "../../context/ReviewsContext";
import { resizeImageToDataUrl } from "../../utils/imageResize";
import ImageLightbox from "../common/ImageLightbox";
import "./Testimonials.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const AUTOPLAY_DELAY = 8000;
const INTERACTION_PAUSE = 5000;
const MAX_TEXT_REVIEWS = 3;

function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const { reviews, addReview } = useReviews();

  const approvedReviews = useMemo(
    () => reviews.filter((review) => review.status === "aprobada"),
    [reviews],
  );
  const textReviews = useMemo(
    () => approvedReviews.filter((review) => !review.image).slice(0, MAX_TEXT_REVIEWS),
    [approvedReviews],
  );
  const imageReview = useMemo(() => approvedReviews.find((review) => review.image), [approvedReviews]);

  const slideCount = (textReviews.length > 0 ? 1 : 0) + (imageReview ? 1 : 0);

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const activeSlideRef = useRef(0);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | undefined>(undefined);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const pauseAutoplay = () => {
    isPausedRef.current = true;
    window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
    }, INTERACTION_PAUSE);
  };

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideCount <= 1) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        Array.from(track.children).forEach((child, index) => {
          const rect = (child as HTMLElement).getBoundingClientRect();
          const childCenter = rect.left + rect.width / 2;
          const distance = Math.abs(childCenter - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveSlide(closestIndex);
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (isPausedRef.current) return;
      scrollToSlide((activeSlideRef.current + 1) % slideCount);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  useEffect(() => {
    return () => window.clearTimeout(resumeTimeoutRef.current);
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReviewImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setReviewImage(dataUrl);
      setImageError("");
    } catch {
      setImageError("No se pudo cargar la imagen. Intenta con otra foto.");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !quote.trim() || rating === 0) return;

    addReview({ name: name.trim(), rating, quote: quote.trim(), image: reviewImage || undefined });
    setName("");
    setRating(0);
    setQuote("");
    setReviewImage("");
    setSubmitted(true);
  };

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <span className="eyebrow">La comunidad habla</span>
        <h2 className="section-title">+500 jugadores nos recomiendan.</h2>

        {slideCount > 0 && (
          <>
            <div className="testimonials__track" ref={trackRef} onPointerDown={pauseAutoplay} onTouchStart={pauseAutoplay}>
              {textReviews.length > 0 && (
                <div className="testimonials__slide">
                  <div className="testimonials__grid">
                    {textReviews.map((review, index) => (
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
                </div>
              )}

              {imageReview && (
                <div className="testimonials__slide">
                  <article className="testimonial-photo-card">
                    <button
                      type="button"
                      className="testimonial-photo-card__media"
                      onClick={() => setLightboxOpen(true)}
                      aria-label="Ampliar foto de la reseña"
                    >
                      <img src={imageReview.image} alt={`Reseña de ${imageReview.name}`} />
                    </button>
                    <div className="testimonial-photo-card__body">
                      <div className="testimonial-card__stars" aria-hidden="true">
                        {Array.from({ length: imageReview.rating }).map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                      <p className="testimonial-card__quote">“{imageReview.quote}”</p>
                      <p className="testimonial-card__author">
                        {imageReview.name}
                        {imageReview.level && (
                          <span className="testimonial-card__level">{levelLabels[imageReview.level]}</span>
                        )}
                      </p>
                    </div>
                  </article>
                </div>
              )}
            </div>

            {slideCount > 1 && (
              <div className="testimonials__dots">
                {Array.from({ length: slideCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`testimonials__dot${index === activeSlide ? " testimonials__dot--active" : ""}`}
                    onClick={() => {
                      pauseAutoplay();
                      scrollToSlide(index);
                    }}
                    aria-label={`Ir a la reseña ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
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

              <label className="review-form__photo">
                {reviewImage ? (
                  <img src={reviewImage} alt="Vista previa" />
                ) : (
                  <span>+ Agregar foto (opcional)</span>
                )}
                <input type="file" accept="image/*" onChange={handleReviewImageChange} hidden />
              </label>
              {imageError && <p className="testimonials__error">{imageError}</p>}

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

      {lightboxOpen && imageReview?.image && (
        <ImageLightbox
          images={[imageReview.image]}
          alt={`Reseña de ${imageReview.name}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
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
