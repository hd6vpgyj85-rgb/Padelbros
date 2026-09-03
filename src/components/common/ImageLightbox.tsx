import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "../home/icons";
import "./ImageLightbox.css";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

function ImageLightbox({ images, initialIndex = 0, alt = "", onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => Math.min(current + 1, images.length - 1));
      if (event.key === "ArrowLeft") setIndex((current) => Math.max(current - 1, 0));
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  if (images.length === 0) return null;

  return createPortal(
    <div className="image-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="image-lightbox__close" onClick={onClose} aria-label="Cerrar">
        <CloseIcon />
      </button>

      <div className="image-lightbox__stage" onClick={(event) => event.stopPropagation()}>
        {images.length > 1 && (
          <button
            type="button"
            className="image-lightbox__nav image-lightbox__nav--prev"
            onClick={() => setIndex((current) => Math.max(current - 1, 0))}
            aria-label="Imagen anterior"
            disabled={index === 0}
          >
            <ArrowLeftIcon />
          </button>
        )}

        <img src={images[index]} alt={alt} className="image-lightbox__image" />

        {images.length > 1 && (
          <button
            type="button"
            className="image-lightbox__nav image-lightbox__nav--next"
            onClick={() => setIndex((current) => Math.min(current + 1, images.length - 1))}
            aria-label="Siguiente imagen"
            disabled={index === images.length - 1}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="image-lightbox__thumbs" onClick={(event) => event.stopPropagation()}>
          {images.map((image, i) => (
            <button
              key={image + i}
              type="button"
              className={`image-lightbox__thumb${i === index ? " image-lightbox__thumb--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

export default ImageLightbox;
