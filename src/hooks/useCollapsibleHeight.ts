import { useEffect, useRef, useState } from "react";

export function useCollapsibleHeight<T extends HTMLElement>(isOpen: boolean, extraDeps: unknown[] = []) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && ref.current) {
      setHeight(ref.current.scrollHeight);
    } else {
      setHeight(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ...extraDeps]);

  return { ref, height };
}
