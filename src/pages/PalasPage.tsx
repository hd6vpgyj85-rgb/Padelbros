import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { useProducts } from "../context/ProductsContext";
import {
  applyProductFilter,
  getAvailableBrands,
  getAvailableLevels,
  getProductsByCategory,
} from "../utils/catalog";

function PalasPage() {
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const palasProducts = useMemo(() => getProductsByCategory(products, "palas"), [products]);
  const availableBrands = useMemo(() => getAvailableBrands(palasProducts), [palasProducts]);
  const availableLevels = useMemo(() => getAvailableLevels(palasProducts), [palasProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(palasProducts, activeFilter),
    [palasProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Palas"
        tagline="Encuentra la pala ideal para tu juego."
      />

      <CategoryHero title="Palas" subtitle="Descubre nuestra colección completa de palas de padel." />

      <ProductFilters
        groups={[
          { type: "brand", options: availableBrands },
          { type: "level", options: availableLevels },
        ]}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
      />

      <ProductGrid products={filteredProducts} />

      <FeaturedCarousel />

      <CategoryFooter />
    </>
  );
}

export default PalasPage;
