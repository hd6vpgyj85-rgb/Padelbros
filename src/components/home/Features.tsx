import { features } from "../../data/features";
import { HandshakeIcon, PeopleIcon, PinIcon, StarBadgeIcon } from "./icons";
import "./Features.css";

const iconMap = {
  people: PeopleIcon,
  star: StarBadgeIcon,
  handshake: HandshakeIcon,
  pin: PinIcon,
};

function Features() {
  return (
    <section className="features">
      <ul className="features__list container">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon];
          return (
            <li
              className={`feature-card${index === 0 ? " feature-card--highlight" : ""}`}
              key={feature.id}
            >
              <Icon className="feature-card__icon" />
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Features;
