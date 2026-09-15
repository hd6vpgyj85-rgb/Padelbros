import { useNavigate } from "react-router-dom";
import { levels } from "../../data/levels";
import { ArrowRightIcon } from "./icons";
import "./LevelsSection.css";

const LEVEL_SLUGS: Record<string, string> = {
  "01": "principiante",
  "02": "intermedio",
  "03": "avanzado",
};

function LevelsSection() {
  const navigate = useNavigate();

  const handleSelect = (levelNumber: string) => {
    const slug = LEVEL_SLUGS[levelNumber];
    navigate(slug ? `/palas?nivel=${slug}` : "/palas");
  };

  return (
    <section className="levels" id="elige-tu-nivel">
      <div className="container">
        <span className="eyebrow">Elige tu nivel</span>
        <h2 className="section-title">Cada jugador merece su pala.</h2>

        <ul className="levels__list">
          {levels.map((level) => (
            <li key={level.number}>
              <button type="button" className="level-card" onClick={() => handleSelect(level.number)}>
                <span className="level-card__number">{level.number}</span>
                <h3 className="level-card__name">{level.name}</h3>
                <p className="level-card__description">{level.description}</p>
                <span className="level-card__arrow" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LevelsSection;
