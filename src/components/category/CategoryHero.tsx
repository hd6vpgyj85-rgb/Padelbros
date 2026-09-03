import "./CategoryHero.css";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
}

function CategoryHero({ title, subtitle }: CategoryHeroProps) {
  return (
    <section className="category-hero">
      <div className="container">
        <h1 className="category-hero__title">{title}</h1>
        <p className="category-hero__subtitle">{subtitle}</p>
      </div>
    </section>
  );
}

export default CategoryHero;
