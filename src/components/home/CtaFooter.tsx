import { getWhatsAppUrl } from "../../data/store";
import { ArrowRightIcon, PhoneIcon } from "./icons";
import "./CtaFooter.css";

function CtaFooter() {
  const whatsappUrl = getWhatsAppUrl(
    "Hola, quiero más información sobre productos de Padelbros.",
  );

  return (
    <section className="cta-footer">
      <div className="container cta-footer__inner">
        <h2 className="cta-footer__title">
          No compres sin antes pasar por Padelbros.
        </h2>
        <p className="cta-footer__text">
          Te aseguramos la pala correcta. Si no, no te vendemos.
        </p>

        <div className="cta-footer__actions">
          <a className="btn btn--dark" href="#top-palas">
            Ver tienda
            <ArrowRightIcon />
          </a>
          <a
            className="btn btn--dark-outline"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PhoneIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default CtaFooter;
