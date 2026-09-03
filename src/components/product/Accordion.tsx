import { useState, type ReactNode } from "react";
import { PlusIcon } from "../home/icons";
import "./Accordion.css";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

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

      <div className={`accordion__panel${isOpen ? " accordion__panel--open" : ""}`}>
        <div className="accordion__content">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
