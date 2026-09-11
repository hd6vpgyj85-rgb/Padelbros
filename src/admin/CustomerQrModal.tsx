import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { CloseIcon } from "../components/home/icons";
import "./CustomerQrModal.css";

interface CustomerQrModalProps {
  customerName: string;
  token: string;
  onClose: () => void;
}

function CustomerQrModal({ customerName, token, onClose }: CustomerQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/fidelidad/${token}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 240, margin: 1 }).catch(() => {});
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin acceso al portapapeles: el link ya está visible para copiarlo a mano.
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-fidelidad-${customerName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return createPortal(
    <div className="customer-qr-modal__overlay" onClick={onClose}>
      <div className="customer-qr-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="customer-qr-modal__close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </button>

        <span className="eyebrow">Tarjeta de fidelidad</span>
        <h2 className="customer-qr-modal__name">{customerName}</h2>

        <div className="customer-qr-modal__canvas-wrap">
          <canvas ref={canvasRef} />
        </div>

        <p className="customer-qr-modal__url">{url}</p>

        <div className="customer-qr-modal__actions">
          <button type="button" className="btn btn--outline" onClick={handleCopy}>
            {copied ? "¡Copiado!" : "Copiar link"}
          </button>
          <button type="button" className="btn btn--primary" onClick={handleDownload}>
            Descargar QR
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CustomerQrModal;
