import "./CtaFooter.css";

function CtaFooter() {
  return (
    <section className="cta-footer">
      <div className="container cta-footer__inner">
        <h2 className="cta-footer__title">
          No compres sin antes pasar por Padelbros.
        </h2>
        <p className="cta-footer__text">
          Te aseguramos la pieza perfecta, tú solo disfruta el juego.
        </p>

        <div className="cta-footer__actions">
          <a className="btn btn--dark" href="#top-palas">
            Ver tienda
          </a>
          <button className="btn btn--dark-outline" type="button">
            WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}

export default CtaFooter;
