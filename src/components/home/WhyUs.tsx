import { useState } from "react";
import { whyUsItems } from "../../data/levels";
import "./WhyUs.css";

function WhyUs() {
  const [selectedNumber, setSelectedNumber] = useState(whyUsItems[0].number);

  return (
    <section className="why-us">
      <div className="container">
        <span className="eyebrow">Por qué Padelbros?</span>

        <ul className="why-us__list">
          {whyUsItems.map((item) => {
            const isSelected = item.number === selectedNumber;
            return (
              <li key={item.number}>
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
