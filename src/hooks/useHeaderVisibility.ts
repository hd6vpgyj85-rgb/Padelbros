import { useEffect, useRef, useState } from "react";

export function useHeaderVisibility(threshold = 8): boolean {
  const [isVisible, setIsVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY.current;

        if (currentY <= 8) {
          setIsVisible(true);
          lastY.current = currentY;
        } else if (delta > threshold) {
          setIsVisible(false);
          lastY.current = currentY;
        } else if (delta < -threshold) {
          setIsVisible(true);
          lastY.current = currentY;
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isVisible;
}
