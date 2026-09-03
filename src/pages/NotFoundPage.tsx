import { Link } from "react-router-dom";
import CategoryFooter from "../components/category/CategoryFooter";
import { RacketPlaceholderIcon } from "../components/home/icons";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import "./NotFoundPage.css";

function NotFoundPage() {
  useDocumentTitle("Página no encontrada | Padelbros");

  return (
    <div className="not-found-page">
      <div className="container not-found-page__content">
        <RacketPlaceholderIcon className="not-found-page__icon" />
        <span className="eyebrow">Error 404</span>
        <h1 className="not-found-page__title">Esta página no existe</h1>
        <p className="not-found-page__text">
          Puede que el enlace esté mal escrito o que la página ya no esté disponible.
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
