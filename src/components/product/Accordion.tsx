import { useState, type ReactNode } from "react";
import { useCollapsibleHeight } from "../../hooks/useCollapsibleHeight";
import { PlusIcon } from "../home/icons";
import "./Accordion.css";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, height } = useCollapsibleHeight<HTMLDivElement>(isOpen);

  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion__toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {title}
        <PlusIcon className={`accordion__icon${isOpen ? " accordion__icon--open" : ""}`} />
      </button>

      <div className="accordion__panel" style={{ maxHeight: height }}>
        <div className="accordion__content" ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
