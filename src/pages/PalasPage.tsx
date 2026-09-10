import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { useProducts } from "../context/ProductsContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { PlayerLevel } from "../types/product";
import { applyProductFilter, getAvailableBrands, getProductsByCategory } from "../utils/catalog";

const LEVELS: PlayerLevel[] = ["principiante", "intermedio", "avanzado"];

function PalasPage() {
  useDocumentTitle("Palas de padel | Padelbros");
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const palasProducts = useMemo(() => getProductsByCategory(products, "palas"), [products]);
  const availableBrands = useMemo(() => getAvailableBrands(palasProducts), [palasProducts]);

  useEffect(() => {
    const marca = searchParams.get("marca");
    if (!marca) return;
    const matchedBrand = availableBrands.find((brand) => brand.toLowerCase() === marca.toLowerCase());
    setActiveFilter({ type: "brand", value: matchedBrand ?? marca });
  }, [searchParams, availableBrands]);

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
        groups={[{ type: "level", options: LEVELS }]}
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
