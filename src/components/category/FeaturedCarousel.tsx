import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../home/icons";
import { products } from "../../data/products";
import { formatPrice } from "../../utils/format";
import { shuffle } from "../../utils/array";
import "./FeaturedCarousel.css";

const CAROUSEL_SIZE = 8;

function FeaturedCarousel() {
  const items = useMemo(() => shuffle(products).slice(0, CAROUSEL_SIZE), []);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

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
    handleScroll();

    return () => {
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const activeProduct = items[activeIndex];

  if (items.length === 0) return null;

  return (
    <section className="featured-carousel">
      <div className="container featured-carousel__header">
        <span className="pill-badge">
          <span className="pill-badge__dot" aria-hidden="true" />
          Especialistas en padel
        </span>
        <h2 className="section-title">Productos destacados</h2>
      </div>

      <div className="featured-carousel__viewport">
        <button
          type="button"
          className="featured-carousel__arrow featured-carousel__arrow--prev"
          onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
          aria-label="Producto anterior"
          disabled={activeIndex === 0}
        >
          <ArrowLeftIcon />
        </button>

        <div className="featured-carousel__track" ref={trackRef}>
          {items.map((product, index) => (
            <div
              className={`featured-carousel__slide${
                index === activeIndex ? " featured-carousel__slide--active" : ""
              }`}
              key={product.id}
            >
              <div className="featured-carousel__media">
                <PlaceholderRacket />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="featured-carousel__arrow featured-carousel__arrow--next"
          onClick={() => scrollToIndex(Math.min(activeIndex + 1, items.length - 1))}
          aria-label="Siguiente producto"
          disabled={activeIndex === items.length - 1}
        >
          <ArrowRightIcon />
        </button>
      </div>

      <div className="featured-carousel__dots">
        {items.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className={`featured-carousel__dot${
              index === activeIndex ? " featured-carousel__dot--active" : ""
            }`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>

      {activeProduct && (
        <div className="container featured-carousel__info">
          <span className="eyebrow">Top venta</span>
          <h3 className="featured-carousel__name">{activeProduct.name}</h3>
          <p className="featured-carousel__price">Desde {formatPrice(activeProduct.price)}</p>
          <button type="button" className="btn btn--primary featured-carousel__cta">
            Ver producto
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </section>
  );
}

function PlaceholderRacket() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="featured-carousel__placeholder"
    >
      <rect x="28" y="10" width="44" height="52" rx="18" stroke="currentColor" strokeWidth="2.5" />
      <line x1="50" y1="62" x2="50" y2="82" stroke="currentColor" strokeWidth="2.5" />
      <rect x="42" y="82" width="16" height="8" rx="3" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export default FeaturedCarousel;
