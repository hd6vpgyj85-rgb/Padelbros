import { Link } from "react-router-dom";
import CategoryFooter from "../components/category/CategoryFooter";
import { BallIcon, RacketPlaceholderIcon } from "../components/home/icons";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "./NotFoundPage.css";

function NotFoundPage() {
  useDocumentTitle("Página no encontrada | Padelbros");

  return (
    <div className="not-found-page">
      <div className="container not-found-page__content">
        {/* La pelota se le escapó a la pala: por eso no hay nada aquí. */}
        <div className="not-found-page__scene" aria-hidden="true">
          <RacketPlaceholderIcon className="not-found-page__icon" />
          <BallIcon className="not-found-page__ball" />
          <span className="not-found-page__ball-shadow" />
        </div>
        <span className="eyebrow">Error 404</span>
        <h1 className="not-found-page__title">Esta bola se fue fuera</h1>
        <p className="not-found-page__text">
          Puede que el enlace esté mal escrito o que la página ya no esté disponible. Regresa a la cancha.
        </p>
        <Link to="/" className="btn btn--primary">
          Volver al inicio
        </Link>
      </div>
      <CategoryFooter />
    </div>
  );
}

export default NotFoundPage;
