import { useEffect, useRef, useState } from "react";

export function useCollapsibleHeight<T extends HTMLElement>(isOpen: boolean) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && ref.current) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return { ref, height };
}
