import { useLocation } from "react-router-dom";
import { getWhatsAppUrl } from "../../data/store";
import "./WhatsAppButton.css";

function WhatsAppButton() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  const whatsappUrl = getWhatsAppUrl("Hola, tengo una pregunta sobre Padelbros.");

  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.15-1.75-.85-2-.95-.28-.1-.48-.15-.68.15-.2.3-.78.95-.95 1.15-.18.2-.35.22-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.08-.13-.28-.2-.58-.35z" />
        <path d="M12.02 2c-5.5 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.15-1.35A9.97 9.97 0 0012.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.2c-1.6 0-3.16-.43-4.53-1.24l-.32-.2-3.05.8.82-2.97-.21-.31A8.18 8.18 0 013.82 12c0-4.53 3.68-8.2 8.2-8.2 4.53 0 8.2 3.67 8.2 8.2 0 4.52-3.67 8.2-8.2 8.2z" />
      </svg>
    </a>
  );
}

export default WhatsAppButton;
