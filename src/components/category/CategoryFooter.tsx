import visitPlayer from "../../assets/palas-visit-player.jpg";
import { storeInfo } from "../../data/store";
import "./CategoryFooter.css";

const footerLinks = [
  "Comunícate con nosotros",
  "Política de garantías",
  "Política de envíos",
  "Síguenos para más promociones",
];

function CategoryFooter() {
  return (
    <footer className="category-footer">
      <img
        className="category-footer__image"
        src={visitPlayer}
        alt="Jugador de padel en cancha con iluminación morada"
      />

      <div className="container category-footer__visit">
        <span className="eyebrow">¡Visítanos!</span>
        <h2 className="category-footer__title">Vive la experiencia Padelbros</h2>

        <p className="category-footer__row">
          <span aria-hidden="true">📍</span>
          {storeInfo.address}
        </p>

        <p className="category-footer__row">
          <span aria-hidden="true">🕐</span>
          <span>
            {storeInfo.hours.map((entry) => (
              <span className="category-footer__hours-line" key={entry.days}>
                {entry.days} {entry.time}
              </span>
            ))}
          </span>
        </p>
      </div>

      <div className="category-footer__links">
        <ul className="container">
          {footerLinks.map((label) => (
            <li key={label}>
              <button type="button" className="category-footer__link">
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default CategoryFooter;
