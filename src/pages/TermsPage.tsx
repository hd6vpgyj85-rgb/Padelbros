import CategoryFooter from "../components/category/CategoryFooter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { storeInfo, getWhatsAppUrl } from "../data/store";
import "./LegalPage.css";

function TermsPage() {
  useDocumentTitle("Términos y condiciones | Padelbros");
  const whatsappUrl = getWhatsAppUrl("Hola, tengo una duda sobre los términos y condiciones de Padelbros.");

  return (
    <div className="legal-page">
      <div className="container">
        <span className="eyebrow legal-page__eyebrow">Padelbros</span>
        <h1 className="legal-page__title">Términos y condiciones</h1>
        <p className="legal-page__updated">Última actualización: 9 de septiembre de 2026</p>
        <p className="legal-page__intro">
          Al realizar un pedido en Padelbros aceptas los siguientes términos. Si tienes cualquier
          duda, escríbenos por WhatsApp antes de confirmar tu compra.
        </p>

        <div className="legal-page__sections">
          <section className="legal-page__section">
            <h2 className="legal-page__section-title">1. Sobre Padelbros</h2>
            <p>
              Padelbros es una tienda de artículos de padel ubicada en {storeInfo.address}. La
              atención a clientes y la confirmación de pedidos se realiza por WhatsApp.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">2. Pedidos</h2>
            <p>
              Los pedidos se generan desde el sitio web y quedan sujetos a disponibilidad de
              stock al momento de la confirmación. Una vez enviado tu pedido, un asesor te
              contactará por WhatsApp para confirmar los detalles y coordinar el pago y la
              entrega.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">3. Precios y formas de pago</h2>
            <p>Todos los precios se muestran en pesos mexicanos (MXN) e incluyen IVA.</p>
            <p>
              El sitio web no procesa pagos en línea: es únicamente para armar tu pedido y
              enviarlo. Una vez recibido, un asesor te contactará por WhatsApp para tratar
              directamente contigo la forma de pago (transferencia bancaria, efectivo en tienda o
              tarjeta) y los datos necesarios para completarlo.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">4. Envíos</h2>
            <p>
              Realizamos envíos a toda la República Mexicana. El costo del envío depende de tu
              ubicación y se confirma por WhatsApp antes de procesar el pago. También puedes
              recoger tu pedido en tienda sin costo adicional.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">5. Cambios, devoluciones y reembolsos</h2>
            <p>
              Por el momento, Padelbros no acepta cambios, devoluciones ni reembolsos una vez
              confirmado el pedido. Te recomendamos revisar bien las características, tallas y
              medidas del producto antes de confirmar tu compra, o resolver tus dudas por
              WhatsApp con un asesor previo a comprar.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">6. Cupones y promociones</h2>
            <p>
              Los cupones de descuento son válidos únicamente mientras estén activos y no hayan
              alcanzado su límite de usos. Aplican sobre el subtotal de un solo pedido y no son
              acumulables entre sí salvo que se indique lo contrario.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">7. Reseñas y contenido de clientes</h2>
            <p>
              Al enviar una reseña nos autorizas a publicar tu nombre, comentario y, si la
              incluyes, tu fotografía en el sitio. Todas las reseñas son revisadas antes de
              publicarse y Padelbros puede rechazar contenido inapropiado.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">8. Cambios a estos términos</h2>
            <p>
              Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor
              en cuanto se publican en esta página.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">9. Contacto</h2>
            <p>
              ¿Dudas sobre tu pedido o estos términos?{" "}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <CategoryFooter />
    </div>
  );
}

export default TermsPage;
