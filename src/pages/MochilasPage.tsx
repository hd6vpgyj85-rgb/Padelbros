import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { products } from "../data/products";
import { getAvailableBrands, getAvailableLevels, getProductsByCategory } from "../utils/catalog";

function MochilasPage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const mochilasProducts = useMemo(() => getProductsByCategory(products, "mochilas"), []);
  const availableBrands = useMemo(() => getAvailableBrands(mochilasProducts), [mochilasProducts]);
  const availableLevels = useMemo(() => getAvailableLevels(mochilasProducts), [mochilasProducts]);

  const filteredProducts = useMemo(() => {
    if (!activeFilter) return mochilasProducts;
    if (activeFilter.type === "brand") {
      return mochilasProducts.filter((product) => product.brand === activeFilter.value);
    }
    return mochilasProducts.filter((product) => product.level === activeFilter.value);
  }, [mochilasProducts, activeFilter]);

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Mochilas"
        tagline="Carga tus palas con estilo."
      />

      <CategoryHero title="Mochilas" subtitle="Descubre nuestra colección completa de mochilas y paleteros." />

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

export default MochilasPage;
