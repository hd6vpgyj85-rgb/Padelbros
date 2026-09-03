import { useState } from "react";
import { levels } from "../../data/levels";
import { ArrowRightIcon } from "./icons";
import "./LevelsSection.css";

function LevelsSection() {
  const [selectedLevel, setSelectedLevel] = useState(levels[0].number);

  const handleSelect = (levelNumber: string) => {
    setSelectedLevel(levelNumber);
    document.getElementById("top-palas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="levels">
      <div className="container">
        <span className="eyebrow">Elige tu nivel</span>
        <h2 className="section-title">Cada jugador merece su pala.</h2>

        <ul className="levels__list">
          {levels.map((level) => {
            const isSelected = level.number === selectedLevel;
            return (
              <li key={level.number}>
                <button
                  type="button"
                  className={`level-card${isSelected ? " level-card--highlight" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(level.number)}
                >
                  <span className="level-card__number">{level.number}</span>
                  <h3 className="level-card__name">{level.name}</h3>
                  <p className="level-card__description">{level.description}</p>
                  <span className="level-card__arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default LevelsSection;
