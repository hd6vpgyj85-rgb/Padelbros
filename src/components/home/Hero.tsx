import heroPlayer from "../../assets/hero-player.jpg";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <img className="hero__bg" src={heroPlayer} alt="" aria-hidden="true" />
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content container">
        <h1 className="hero__title">
          La tienda de <span className="hero__title-accent">padel</span> en Cd
          Juárez.
        </h1>

        <a className="btn btn--primary hero__cta" href="#top-palas">
          Ver más
        </a>

        <div className="hero__rating">
          <div className="hero__stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="hero__rating-text">
            +500 jugadores confían en Padelbros
          </p>
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

export default Hero;
