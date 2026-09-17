import { useEffect, useState } from "react";

// Anima un número desde 0 hasta su valor final. Si el usuario pidió menos
// movimiento, el número aparece de una vez.
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (target <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
