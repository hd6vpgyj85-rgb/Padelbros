import { Link } from "react-router-dom";
import visitPlayer from "../../assets/palas-visit-player.jpg";
import { storeInfo, getWhatsAppUrl } from "../../data/store";
import "./CategoryFooter.css";

const whatsappUrl = getWhatsAppUrl("Hola, quiero más información sobre productos de Padelbros.");

const footerLinks = [
  { label: "Comunícate con nosotros", href: whatsappUrl, external: true },
  { label: "Términos y condiciones", to: "/terminos" },
  { label: "Privacidad y cookies", to: "/privacidad" },
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
          {footerLinks.map((link) =>
            link.to ? (
              <li key={link.label}>
                <Link to={link.to} className="category-footer__link">
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="category-footer__link"
                >
                  {link.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </footer>
  );
}

export default CategoryFooter;
