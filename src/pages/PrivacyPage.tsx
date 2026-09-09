import CategoryFooter from "../components/category/CategoryFooter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getWhatsAppUrl } from "../data/store";
import "./LegalPage.css";

function PrivacyPage() {
  useDocumentTitle("Privacidad y cookies | Padelbros");
  const whatsappUrl = getWhatsAppUrl("Hola, tengo una duda sobre el manejo de mis datos en Padelbros.");

  return (
    <div className="legal-page">
      <div className="container">
        <span className="eyebrow legal-page__eyebrow">Padelbros</span>
        <h1 className="legal-page__title">Privacidad y cookies</h1>
        <p className="legal-page__updated">Última actualización: 9 de septiembre de 2026</p>
        <p className="legal-page__intro">
          Esta página explica qué información recopilamos en padelbros.padelbrosmx26.workers.dev,
          cómo la usamos y qué herramientas hacen funcionar el sitio.
        </p>

        <div className="legal-page__sections">
          <section className="legal-page__section">
            <h2 className="legal-page__section-title">1. Qué información recopilamos</h2>
            <p>Recopilamos datos únicamente cuando tú los proporcionas de forma directa:</p>
            <ul>
              <li>Al hacer un pedido: nombre, apellido, teléfono, correo y dirección de envío.</li>
              <li>Al dejar una reseña: nombre, nivel de juego, comentario y, opcionalmente, una foto.</li>
              <li>Al aplicar un cupón: el código que ingresas.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">2. Cómo usamos tu información</h2>
            <p>
              Usamos tus datos para procesar tu pedido, contactarte por WhatsApp sobre su estado
              y, si nos das una reseña, mostrarla en el sitio una vez aprobada. No usamos tu
              información para publicidad ni la vendemos a terceros.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">3. Dónde se almacenan tus datos</h2>
            <p>
              Tus datos se guardan en Supabase, un proveedor de bases de datos en la nube con
              acceso restringido: solo el personal autorizado de Padelbros puede consultar
              pedidos y datos de contacto, mediante inicio de sesión protegido.
            </p>
            <p>
              El sitio está alojado en Cloudflare y toda la conexión viaja cifrada mediante
              HTTPS.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">4. Comunicación por WhatsApp</h2>
            <p>
              Al confirmar un pedido, se envía un resumen del mismo (productos, dirección y
              total) a través de WhatsApp para darle seguimiento. Esos mensajes se transmiten a
              través de WhatsApp/Meta y quedan sujetos a la política de privacidad de esa
              plataforma.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">5. Cookies y almacenamiento local</h2>
            <p>
              Padelbros no utiliza cookies de rastreo, publicidad ni analítica de terceros. El
              sitio guarda el contenido de tu carrito de compras únicamente en el almacenamiento
              local de tu navegador (localStorage), en tu propio dispositivo. Esta información no
              se envía a ningún servidor hasta que confirmas un pedido, y se borra si limpias los
              datos del sitio o cambias de dispositivo o navegador.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">6. Con quién compartimos tu información</h2>
            <p>
              No compartimos ni vendemos tus datos a terceros con fines comerciales. Solo
              recurrimos a los proveedores necesarios para operar el sitio (Supabase para
              almacenamiento, Cloudflare para el hosting) y a WhatsApp para comunicarte sobre tu
              pedido.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">7. Tus derechos</h2>
            <p>
              Puedes solicitar acceso, corrección o eliminación de tus datos personales en
              cualquier momento escribiéndonos por WhatsApp.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">8. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política si cambian las herramientas o procesos del sitio.
              La fecha de la última actualización se indica al inicio de esta página.
            </p>
          </section>

          <section className="legal-page__section">
            <h2 className="legal-page__section-title">9. Contacto</h2>
            <p>
              ¿Dudas sobre el manejo de tus datos?{" "}
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

export default PrivacyPage;
