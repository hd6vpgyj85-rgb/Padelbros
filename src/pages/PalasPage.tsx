import { useMemo, useState } from "react";
import CategoryHero from "../components/palas/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/palas/ProductFilters";
import ProductGrid from "../components/palas/ProductGrid";
import FeaturedCarousel from "../components/palas/FeaturedCarousel";
import CategoryFooter from "../components/palas/CategoryFooter";
import { products } from "../data/products";
import { getAvailableBrands, getAvailableLevels, getProductsByCategory } from "../utils/catalog";

function PalasPage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const palasProducts = useMemo(() => getProductsByCategory(products, "palas"), []);
  const availableBrands = useMemo(() => getAvailableBrands(palasProducts), [palasProducts]);
  const availableLevels = useMemo(() => getAvailableLevels(palasProducts), [palasProducts]);

  const filteredProducts = useMemo(() => {
    if (!activeFilter) return palasProducts;
    if (activeFilter.type === "brand") {
      return palasProducts.filter((product) => product.brand === activeFilter.value);
    }
    return palasProducts.filter((product) => product.level === activeFilter.value);
  }, [palasProducts, activeFilter]);

  return (
    <>
      <CategoryHero title="Palas" subtitle="Descubre nuestra colección completa de palas de padel." />

      <ProductFilters
        brands={availableBrands}
        levels={availableLevels}
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
