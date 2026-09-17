import { useState } from "react";
import { features } from "../../data/features";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { HandshakeIcon, PeopleIcon, PinIcon, StarBadgeIcon } from "./icons";
import "./Features.css";

const iconMap = {
  people: PeopleIcon,
  star: StarBadgeIcon,
  handshake: HandshakeIcon,
  pin: PinIcon,
};

function Features() {
  const [selectedId, setSelectedId] = useState(features[0].id);
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);

  return (
    <section className="features" ref={ref}>
      <ul className="features__list container">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon];
          const isSelected = feature.id === selectedId;
          return (
            <li
              key={feature.id}
              className={`reveal${isVisible ? " reveal--visible" : ""}`}
              style={{ transitionDelay: `${index * 0.09}s` }}
            >
              <button
                type="button"
                className={`feature-card${isSelected ? " feature-card--highlight" : ""}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedId(feature.id)}
              >
                <Icon className="feature-card__icon" />
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Features;
