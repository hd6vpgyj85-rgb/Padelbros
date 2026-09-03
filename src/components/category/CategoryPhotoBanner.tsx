import "./CategoryPhotoBanner.css";

interface CategoryPhotoBannerProps {
  image: string;
  categoryName: string;
  tagline: string;
}

function CategoryPhotoBanner({ image, categoryName, tagline }: CategoryPhotoBannerProps) {
  return (
    <section className="category-photo-banner">
      <img className="category-photo-banner__bg" src={image} alt="" aria-hidden="true" />
      <div className="category-photo-banner__overlay" aria-hidden="true" />

      <div className="container category-photo-banner__content">
        <span className="eyebrow">Colección</span>
        <h2 className="category-photo-banner__title">{categoryName}</h2>
        <p className="category-photo-banner__tagline">{tagline}</p>
      </div>
    </section>
  );
}

export default CategoryPhotoBanner;
