import { useEffect, useRef, useState, type ReactNode } from "react";
import ImageLightbox from "../common/ImageLightbox";
import { RacketPlaceholderIcon } from "../home/icons";
import "./ProductGallery.css";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  badge?: ReactNode;
}

function ProductGallery({ images, productName, badge }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length <= 1) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        Array.from(track.children).forEach((child, index) => {
          const rect = (child as HTMLElement).getBoundingClientRect();
          const childCenter = rect.left + rect.width / 2;
          const distance = Math.abs(childCenter - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery__slide product-gallery__slide--empty">
          {badge}
          <RacketPlaceholderIcon className="product-gallery__placeholder" />
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main" ref={trackRef}>
        {images.map((image, index) => (
          <button
            type="button"
            className="product-gallery__slide"
            key={image + index}
            onClick={() => {
              setActiveIndex(index);
              setIsLightboxOpen(true);
            }}
            aria-label={`Ampliar imagen ${index + 1} de ${productName}`}
          >
            {index === 0 && badge}
            <img src={image} alt={`${productName} - foto ${index + 1}`} className="product-gallery__photo" />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="product-gallery__dots">
          {images.map((image, index) => (
            <span
              key={image + index}
              className={`product-gallery__dot${index === activeIndex ? " product-gallery__dot--active" : ""}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="product-gallery__thumbs">
          {images.map((image, index) => (
            <button
              type="button"
              key={image + index}
              className={`product-gallery__thumb${index === activeIndex ? " product-gallery__thumb--active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
              aria-label={`Ver foto ${index + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={activeIndex}
          alt={productName}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

export default ProductGallery;
