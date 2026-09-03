import { levels } from "../../data/levels";
import "./LevelsSection.css";

function LevelsSection() {
  return (
    <section className="levels">
      <div className="container">
        <span className="eyebrow">Elige tu nivel</span>
        <h2 className="section-title">Cada jugador merece su pala.</h2>

        <ol className="levels__list">
          {levels.map((level) => (
            <li className="level-item" key={level.number}>
              <span className="level-item__number">{level.number}</span>
              <div>
                <h3 className="level-item__name">{level.name}</h3>
                <p className="level-item__description">{level.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default LevelsSection;
