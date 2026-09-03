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
import { applyProductFilter, getAvailableBrands, getProductsByCategory } from "../utils/catalog";

function TenisPage() {
  useDocumentTitle("Tenis de padel | Padelbros");
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const tenisProducts = useMemo(() => getProductsByCategory(products, "tenis"), [products]);
  const availableBrands = useMemo(() => getAvailableBrands(tenisProducts), [tenisProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(tenisProducts, activeFilter),
    [tenisProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Tenis"
        tagline="El juego empieza en tus pies."
      />

      <CategoryHero title="Tenis" subtitle="Descubre nuestra colección completa de tenis." />

      <ProductFilters
        groups={[{ type: "brand", options: availableBrands }]}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
      />

      <ProductGrid products={filteredProducts} />

      <FeaturedCarousel />

      <CategoryFooter />
    </>
  );
}

export default TenisPage;
