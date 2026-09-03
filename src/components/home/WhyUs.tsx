import { whyUsItems } from "../../data/levels";
import "./WhyUs.css";

function WhyUs() {
  return (
    <section className="why-us">
      <div className="container">
        <span className="eyebrow">Por qué Padelbros?</span>

        <ol className="why-us__list">
          {whyUsItems.map((item) => (
            <li className="why-us-item" key={item.number}>
              <span className="why-us-item__number">{item.number}</span>
              <p className="why-us-item__description">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WhyUs;
