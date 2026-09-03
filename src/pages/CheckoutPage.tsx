import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import CategoryFooter from "../components/category/CategoryFooter";
import { useCart } from "../context/CartContext";
import { getWhatsAppUrl, storeInfo } from "../data/store";
import { formatPrice } from "../utils/format";
import "./CheckoutPage.css";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const paymentMethods = [
  "Transferencia bancaria",
  "Efectivo en tienda",
  "Tarjeta (liga de pago)",
  "Por definir con un asesor",
];

interface FormState {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  referencias: string;
  metodoPago: string;
  notas: string;
  calificacion: number;
  experiencia: string;
  cupon: string;
}

const initialForm: FormState = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
  calle: "",
  colonia: "",
  ciudad: "",
  estado: "",
  codigoPostal: "",
  pais: "México",
  referencias: "",
  metodoPago: "",
  notas: "",
  calificacion: 0,
  experiencia: "",
  cupon: "",
};

const requiredFields: Array<keyof FormState> = [
  "nombre",
  "apellido",
  "correo",
  "telefono",
  "calle",
  "colonia",
  "ciudad",
  "estado",
  "codigoPostal",
  "metodoPago",
];

function buildWhatsAppMessage(form: FormState, lines: { name: string; quantity: number; price: number; level?: string }[], totalPrice: number) {
  const productLines = lines
    .map((line) => `• ${line.name} x${line.quantity} — ${formatPrice(line.price * line.quantity)}`)
    .join("\n");

  const parts = [
    "🎾 *Nuevo pedido - Padelbros*",
    "",
    "*Productos:*",
    productLines,
    "",
    `*Total estimado:* ${formatPrice(totalPrice)}`,
    form.cupon ? `*Cupón:* ${form.cupon}` : null,
    "",
    "*Datos del cliente:*",
    `Nombre: ${form.nombre} ${form.apellido}`,
    `Correo: ${form.correo}`,
    `Teléfono: +52 ${form.telefono}`,
    "",
    "*Dirección de envío:*",
    `${form.calle}, ${form.colonia}`,
    `${form.ciudad}, ${form.estado}, CP ${form.codigoPostal}`,
    `País: ${form.pais}`,
    form.referencias ? `Referencias: ${form.referencias}` : null,
    "",
    `*Método de pago:* ${form.metodoPago}`,
    form.notas ? `\n*Notas del pedido:* ${form.notas}` : null,
    form.calificacion > 0
      ? `\n*Reseña:* ${form.calificacion}/5${form.experiencia ? ` - "${form.experiencia}"` : ""}`
      : null,
  ];

  return parts.filter((part) => part !== null).join("\n");
}

function CheckoutPage() {
  const { lines, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof FormState, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof FormState, boolean>> = {};
    requiredFields.forEach((field) => {
      if (!String(form[field]).trim()) nextErrors[field] = true;
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const message = buildWhatsAppMessage(
      form,
      lines.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        price: product.price,
        level: product.level,
      })),
      totalPrice,
    );

    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    clearCart();
    setSubmitted(true);
  };

  if (lines.length === 0 && !submitted) {
    return (
      <div className="checkout-page">
        <div className="container checkout-page__empty">
          <p>No tienes productos en tu carrito para continuar con el pedido.</p>
          <Link to="/palas" className="btn btn--primary">
            Ver productos
          </Link>
        </div>
        <CategoryFooter />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="checkout-page">
        <div className="container checkout-page__empty">
          <p className="checkout-page__success-title">¡Pedido enviado!</p>
          <p>Continúa la conversación en WhatsApp para confirmar tu pedido con {storeInfo.address}.</p>
          <Link to="/" className="btn btn--primary">
            Volver al inicio
          </Link>
        </div>
        <CategoryFooter />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <form className="container checkout-page__form" onSubmit={handleSubmit}>
        <section className="checkout-section">
          <span className="checkout-section__title">Tu pedido</span>

          <ul className="checkout-order-list">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="checkout-order-item">
                <div>
                  <p className="checkout-order-item__name">
                    {product.name}
                    {product.level ? ` - ${levelLabels[product.level]}` : ""}
                  </p>
                  <p className="checkout-order-item__qty">Cantidad: {quantity}</p>
                </div>
                <p className="checkout-order-item__price">{formatPrice(product.price * quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="checkout-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="checkout-summary-row">
            <span>Envío</span>
            <span>Por acordar</span>
          </div>
          <div className="checkout-summary-row checkout-summary-row--total">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </section>

        <section className="checkout-section">
          <span className="checkout-section__title">Cupón de descuento</span>
          <div className="checkout-coupon">
            <input
              type="text"
              placeholder="Tu código de cupón"
              value={form.cupon}
              onChange={(event) => updateField("cupon", event.target.value)}
            />
            <button type="button" className="checkout-coupon__apply">
              Aplicar
            </button>
          </div>
        </section>

        <button type="submit" className="checkout-submit-btn">
          Enviar pedido
        </button>

        <ul className="checkout-trust-bullets">
          <li>Envío a toda la República</li>
          <li>Atención personalizada</li>
          <li>+500 jugadores en Juárez</li>
        </ul>

        <div ref={formRef} />

        <section className="checkout-section">
          <span className="checkout-section__title">Tus datos</span>

          <label className="checkout-field">
            <span>Nombre *</span>
            <input
              type="text"
              value={form.nombre}
              onChange={(event) => updateField("nombre", event.target.value)}
              className={errors.nombre ? "checkout-field--error" : ""}
              placeholder="Juan"
            />
          </label>

          <label className="checkout-field">
            <span>Apellido *</span>
            <input
              type="text"
              value={form.apellido}
              onChange={(event) => updateField("apellido", event.target.value)}
              className={errors.apellido ? "checkout-field--error" : ""}
              placeholder="Pérez"
            />
          </label>

          <label className="checkout-field">
            <span>Correo electrónico *</span>
            <input
              type="email"
              value={form.correo}
              onChange={(event) => updateField("correo", event.target.value)}
              className={errors.correo ? "checkout-field--error" : ""}
              placeholder="tu@correo.com"
            />
          </label>

          <label className="checkout-field">
            <span>Teléfono *</span>
            <div className="checkout-phone">
              <span className="checkout-phone__prefix">MX +52</span>
              <input
                type="tel"
                value={form.telefono}
                onChange={(event) => updateField("telefono", event.target.value)}
                className={errors.telefono ? "checkout-field--error" : ""}
                placeholder="656 123 4567"
              />
            </div>
          </label>
        </section>

        <section className="checkout-section">
          <span className="checkout-section__title">Dirección de envío</span>

          <label className="checkout-field">
            <span>Calle y número *</span>
            <input
              type="text"
              value={form.calle}
              onChange={(event) => updateField("calle", event.target.value)}
              className={errors.calle ? "checkout-field--error" : ""}
              placeholder="Av. Tecnológico 1234"
            />
          </label>

          <label className="checkout-field">
            <span>Colonia *</span>
            <input
              type="text"
              value={form.colonia}
              onChange={(event) => updateField("colonia", event.target.value)}
              className={errors.colonia ? "checkout-field--error" : ""}
              placeholder="Col. Centro"
            />
          </label>

          <label className="checkout-field">
            <span>Ciudad *</span>
            <input
              type="text"
              value={form.ciudad}
              onChange={(event) => updateField("ciudad", event.target.value)}
              className={errors.ciudad ? "checkout-field--error" : ""}
              placeholder="Ciudad Juárez"
            />
          </label>

          <label className="checkout-field">
            <span>Estado *</span>
            <input
              type="text"
              value={form.estado}
              onChange={(event) => updateField("estado", event.target.value)}
              className={errors.estado ? "checkout-field--error" : ""}
              placeholder="Chihuahua"
            />
          </label>

          <label className="checkout-field">
            <span>Código postal *</span>
            <input
              type="text"
              value={form.codigoPostal}
              onChange={(event) => updateField("codigoPostal", event.target.value)}
              className={errors.codigoPostal ? "checkout-field--error" : ""}
              placeholder="32000"
            />
          </label>

          <label className="checkout-field">
            <span>País</span>
            <select value={form.pais} onChange={(event) => updateField("pais", event.target.value)}>
              <option value="México">México</option>
            </select>
          </label>

          <label className="checkout-field">
            <span>Referencias (opcional)</span>
            <textarea
              value={form.referencias}
              onChange={(event) => updateField("referencias", event.target.value)}
              placeholder="Entre calles, color de casa, etc."
              rows={2}
            />
          </label>
        </section>

        <section className="checkout-section">
          <span className="checkout-section__title">Método de pago</span>

          <label className="checkout-field">
            <span>Forma de pago *</span>
            <select
              value={form.metodoPago}
              onChange={(event) => updateField("metodoPago", event.target.value)}
              className={errors.metodoPago ? "checkout-field--error" : ""}
            >
              <option value="">Selecciona un método</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
          <p className="checkout-hint">Los datos de pago se enviarán por WhatsApp al confirmar.</p>
        </section>

        <section className="checkout-section">
          <span className="checkout-section__title">Comentarios</span>
          <label className="checkout-field">
            <span>Notas para tu pedido (opcional)</span>
            <textarea
              value={form.notas}
              onChange={(event) => updateField("notas", event.target.value)}
              placeholder="Instrucciones especiales, talla, color preferido..."
              rows={2}
            />
          </label>
        </section>

        <section className="checkout-section">
          <span className="checkout-section__title">Deja tu reseña</span>

          <div className="checkout-field">
            <span>Calificación</span>
            <div className="checkout-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`checkout-stars__btn${value <= form.calificacion ? " checkout-stars__btn--active" : ""}`}
                  onClick={() => updateField("calificacion", value === form.calificacion ? 0 : value)}
                  aria-label={`Calificar con ${value} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <label className="checkout-field">
            <span>Tu experiencia (opcional)</span>
            <textarea
              value={form.experiencia}
              onChange={(event) => updateField("experiencia", event.target.value)}
              placeholder="Cuéntanos cómo fue tu compra en Padelbros..."
              rows={2}
            />
          </label>
        </section>
      </form>

      <CategoryFooter />
    </div>
  );
}

export default CheckoutPage;
