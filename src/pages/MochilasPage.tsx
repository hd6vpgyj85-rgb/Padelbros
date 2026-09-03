import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { useProducts } from "../context/ProductsContext";
import { applyProductFilter, getAvailableBrands, getProductsByCategory } from "../utils/catalog";

function MochilasPage() {
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const mochilasProducts = useMemo(() => getProductsByCategory(products, "mochilas"), [products]);
  const availableBrands = useMemo(() => getAvailableBrands(mochilasProducts), [mochilasProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(mochilasProducts, activeFilter),
    [mochilasProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Mochilas"
        tagline="Carga tus palas con estilo."
      />

      <CategoryHero title="Mochilas" subtitle="Descubre nuestra colección completa de mochilas y paleteros." />

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

export default MochilasPage;
