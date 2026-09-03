import { levels } from "../../data/levels";
import { ArrowRightIcon } from "./icons";
import "./LevelsSection.css";

function LevelsSection() {
  return (
    <section className="levels">
      <div className="container">
        <span className="eyebrow">Elige tu nivel</span>
        <h2 className="section-title">Cada jugador merece su pala.</h2>

        <ul className="levels__list">
          {levels.map((level, index) => (
            <li
              className={`level-card${index === 0 ? " level-card--highlight" : ""}`}
              key={level.number}
            >
              <span className="level-card__number">{level.number}</span>
              <h3 className="level-card__name">{level.name}</h3>
              <p className="level-card__description">{level.description}</p>
              <button className="level-card__arrow" type="button" aria-label={`Ver palas de nivel ${level.name}`}>
                <ArrowRightIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LevelsSection;
