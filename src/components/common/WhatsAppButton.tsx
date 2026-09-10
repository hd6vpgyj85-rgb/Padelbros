import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getWhatsAppUrl } from "../../data/store";
import "./WhatsAppButton.css";

const STORAGE_KEY = "padelbros-whatsapp-position";
const BUTTON_SIZE = 56;
const EDGE_MARGIN = 8;
const DRAG_THRESHOLD = 6;

interface Position {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clampToViewport(position: Position): Position {
  const maxX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
  const maxY = window.innerHeight - BUTTON_SIZE - EDGE_MARGIN;
  return {
    x: clamp(position.x, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxX)),
    y: clamp(position.y, EDGE_MARGIN, Math.max(EDGE_MARGIN, maxY)),
  };
}

function WhatsAppButton() {
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(
    null,
  );
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        setPosition(clampToViewport(parsed));
      }
    } catch {
      // localStorage no disponible o dato corrupto: se ignora y queda la posición por defecto.
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setPosition((current) => (current ? clampToViewport(current) : current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  const whatsappUrl = getWhatsAppUrl("Hola, tengo una pregunta sobre Padelbros.");

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const el = buttonRef.current;
    if (!drag || !el) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    if (!drag.moved) el.classList.add("whatsapp-float--dragging");
    drag.moved = true;

    const next = clampToViewport({ x: drag.originX + dx, y: drag.originY + dy });
    el.style.left = `${next.x}px`;
    el.style.top = `${next.y}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const el = buttonRef.current;
    dragRef.current = null;
    el?.releasePointerCapture(event.pointerId);
    if (!drag) return;

    if (drag.moved) {
      el?.classList.remove("whatsapp-float--dragging");
      const rect = el?.getBoundingClientRect();
      if (rect) {
        const finalPosition = clampToViewport({ x: rect.left, y: rect.top });
        setPosition(finalPosition);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalPosition));
        } catch {
          // Sin almacenamiento disponible: la posición solo dura mientras no se recargue la página.
        }
      }
    } else {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const style = position
    ? { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" }
    : undefined;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="whatsapp-float"
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Escríbenos por WhatsApp. Se puede arrastrar."
    >
      <span className="whatsapp-float__glow" aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.15-1.75-.85-2-.95-.28-.1-.48-.15-.68.15-.2.3-.78.95-.95 1.15-.18.2-.35.22-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.08-.13-.28-.2-.58-.35z" />
        <path d="M12.02 2c-5.5 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.15-1.35A9.97 9.97 0 0012.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.2c-1.6 0-3.16-.43-4.53-1.24l-.32-.2-3.05.8.82-2.97-.21-.31A8.18 8.18 0 013.82 12c0-4.53 3.68-8.2 8.2-8.2 4.53 0 8.2 3.67 8.2 8.2 0 4.52-3.67 8.2-8.2 8.2z" />
      </svg>
    </button>
  );
}

export default WhatsAppButton;
