import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { products } from "../data/products";
import { applyProductFilter, getAvailableBrands, getProductsByCategory } from "../utils/catalog";

function AccesoriosPage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const accesoriosProducts = useMemo(() => getProductsByCategory(products, "accesorios"), []);
  const availableBrands = useMemo(() => getAvailableBrands(accesoriosProducts), [accesoriosProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(accesoriosProducts, activeFilter),
    [accesoriosProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Accesorios"
        tagline="Mejora tu estilo en cada detalle."
      />

      <CategoryHero title="Accesorios" subtitle="Descubre nuestra colección completa de accesorios." />

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

export default AccesoriosPage;
