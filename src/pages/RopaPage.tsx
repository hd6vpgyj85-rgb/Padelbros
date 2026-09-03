import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { useProducts } from "../context/ProductsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { applyProductFilter, getAvailableSizes, getProductsByCategory } from "../utils/catalog";

function RopaPage() {
  useDocumentTitle("Ropa de padel | Padelbros");
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const ropaProducts = useMemo(() => getProductsByCategory(products, "ropa"), [products]);
  const availableSizes = useMemo(() => getAvailableSizes(ropaProducts), [ropaProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(ropaProducts, activeFilter),
    [ropaProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Ropa de Padel"
        tagline="Viste con las mejores marcas."
      />

      <CategoryHero title="Ropa" subtitle="Descubre nuestra colección completa de ropa." />

      <ProductFilters
        groups={[{ type: "size", options: availableSizes }]}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
      />

      <ProductGrid products={filteredProducts} />

      <FeaturedCarousel />

      <CategoryFooter />
    </>
  );
}

export default RopaPage;
