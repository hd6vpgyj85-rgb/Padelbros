import { useScrollReveal } from "../../hooks/useScrollReveal";
import visitPlayer from "../../assets/visit-player.jpg";
import { storeInfo } from "../../data/store";
import "./VisitUs.css";

function VisitUs() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section className="visit-us" ref={ref}>
      <div className="container visit-us__grid">
        <img
          className={`visit-us__image reveal${isVisible ? " reveal--visible" : ""}`}
          src={visitPlayer}
          alt="Jugador de padel descansando en la cancha con una Red Bull"
        />

        <div
          className={`visit-us__content reveal${isVisible ? " reveal--visible" : ""}`}
          style={{ transitionDelay: "0.15s" }}
        >
          <span className="eyebrow">Visítanos</span>
          <h2 className="section-title">Vive la experiencia Padelbros.</h2>

          <p className="visit-us__text">
            Más que una tienda. Un espacio para jugadores. Recibe asesoría
            experta y conecta con la comunidad de padel de Juárez.
          </p>

          <div className="visit-us__details">
            <div className="visit-us__detail">
              <span className="visit-us__label">Dirección</span>
              <p className="visit-us__value">{storeInfo.address}</p>
            </div>

            <div className="visit-us__detail">
              <span className="visit-us__label">Horario</span>
              {storeInfo.hours.map((entry) => (
                <p className="visit-us__value" key={entry.days}>
                  {entry.days} · {entry.time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisitUs;
