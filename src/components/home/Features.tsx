import { features } from "../../data/features";
import { CompassIcon, StarBadgeIcon, StoreIcon, TargetIcon } from "./icons";
import "./Features.css";

const iconMap = {
  target: TargetIcon,
  star: StarBadgeIcon,
  compass: CompassIcon,
  store: StoreIcon,
};

function Features() {
  return (
    <section className="features">
      <ul className="features__list container">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <li className="feature-item" key={feature.id}>
              <Icon className="feature-item__icon" />
              <div>
                <h3 className="feature-item__title">{feature.title}</h3>
                <p className="feature-item__description">{feature.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Features;
