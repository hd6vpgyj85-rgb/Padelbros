import CategoryFooter from "../components/category/CategoryFooter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getWhatsAppUrl } from "../data/store";
import "./LegalPage.css";

function WarrantyPage() {
  useDocumentTitle("Política de garantías | Padelbros");
  const whatsappUrl = getWhatsAppUrl("Hola, quiero tramitar la garantía de una pala que compré en Padelbros.");

  return (
    <div className="legal-page">
      <div className="container">
        <span className="eyebrow legal-page__eyebrow">Padelbros</span>
        <h1 className="legal-page__title">Política de garantías</h1>
        <p className="legal-page__updated">Última actualización: 15 de septiembre de 2026</p>
        <p className="legal-page__intro">
          En Padelbros todos nuestros productos son 100% originales. Para brindarte total
          tranquilidad en tu compra, te explicamos cómo funciona la garantía para palas y
          artículos de padel.
        </p>

        <div className="legal-page__sections">
          <section className="legal-page__section">
            <h2 className="legal-page__section-title">1. Cobertura y período de garantía</h2>
            <p>
              <strong>Vigencia:</strong> Todas nuestras palas cuentan con una garantía de hasta 4
              meses a partir de la fecha de tu compra.
            </p>
            <p>
              <strong>¿Qué cubre?</strong> La garantía aplica únicamente para defectos de
              fabricación (por ejemplo: fisuras internas no provocadas por impacto, grietas en la
              cara sin señal de golpe externo, desprendimiento no habitual del tapón o cordón, o
              defectos de fábrica en la estructura).
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">2. ¿Qué no cubre la garantía?</h2>
            <p>La garantía no aplica bajo las siguientes condiciones:</p>
            <ul>
              <li>
                Daños provocados por golpes o impactos (contra las paredes o rejas de la cancha,
                la pala del compañero, el suelo o la red).
              </li>
              <li>Rozaduras, desgaste natural del material por uso continuo o raspones en el marco.</li>
              <li>
                Daños causados por mal uso, almacenamiento inadecuado (como dejar la pala expuesta
                al calor extremo dentro de un vehículo) o modificaciones realizadas al producto.
              </li>
              <li>Desgaste normal en artículos de consumo (grips, overgrips, protectores o pelotas).</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">3. Proceso de evaluación y solicitud</h2>
            <p>
              Debido a que somos distribuidores autorizados, las garantías son evaluadas
              minuciosamente por el equipo técnico del proveedor oficial del fabricante para
              dictaminar el origen de la falla.
            </p>
            <p>Para iniciar tu trámite, sigue estos pasos:</p>
            <ul>
              <li>
                <strong>Contacto:</strong> Escríbenos por WhatsApp con tu número de pedido y
                comprobante de compra.
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">4. Contacto</h2>
            <p>
              ¿Quieres tramitar una garantía o tienes dudas sobre su cobertura?{" "}
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

export default WarrantyPage;
