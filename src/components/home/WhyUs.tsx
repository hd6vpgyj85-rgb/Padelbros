import { useState } from "react";
import { whyUsItems } from "../../data/levels";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./WhyUs.css";

function WhyUs() {
  const [selectedNumber, setSelectedNumber] = useState(whyUsItems[0].number);
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section className="why-us" ref={ref}>
      <div className="container">
        <span className={`eyebrow reveal${isVisible ? " reveal--visible" : ""}`}>Por qué Padelbros?</span>

        <ul className="why-us__list">
          {whyUsItems.map((item, index) => {
            const isSelected = item.number === selectedNumber;
            return (
              <li
                key={item.number}
                className={`reveal${isVisible ? " reveal--visible" : ""}`}
                style={{ transitionDelay: `${0.1 + index * 0.09}s` }}
              >
                <button
                  type="button"
                  className={`why-us-item${isSelected ? " why-us-item--active" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedNumber(item.number)}
                >
                  <span className="why-us-item__number">{item.number}</span>
                  <span className="why-us-item__description">{item.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default WhyUs;
