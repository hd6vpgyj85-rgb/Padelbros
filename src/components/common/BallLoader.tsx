import { BallIcon } from "../home/icons";
import "./BallLoader.css";

interface BallLoaderProps {
  label?: string;
  variant?: "page" | "inline";
}

function BallLoader({ label = "Cargando...", variant = "page" }: BallLoaderProps) {
  return (
    <div className={`ball-loader ball-loader--${variant}`} role="status" aria-live="polite">
      <div className="ball-loader__scene">
        <BallIcon className="ball-loader__ball" />
        <span className="ball-loader__shadow" aria-hidden="true" />
      </div>
      <p className="ball-loader__label">{label}</p>
    </div>
  );
}

export default BallLoader;
