import { testimonials } from "../../data/testimonials";
import "./Testimonials.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <span className="eyebrow">La comunidad habla</span>
        <h2 className="section-title">+500 jugadores nos recomiendan.</h2>

        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-card__stars" aria-hidden="true">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="testimonial-card__quote">“{testimonial.quote}”</p>
              <p className="testimonial-card__author">
                {testimonial.name}
                <span className="testimonial-card__level">
                  {levelLabels[testimonial.level]}
                </span>
              </p>
            </article>
          ))}
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
