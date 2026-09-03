import { useMemo, useState } from "react";
import heroPlayer from "../assets/hero-player.jpg";
import CategoryPhotoBanner from "../components/category/CategoryPhotoBanner";
import CategoryHero from "../components/category/CategoryHero";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import FeaturedCarousel from "../components/category/FeaturedCarousel";
import CategoryFooter from "../components/category/CategoryFooter";
import { products } from "../data/products";
import { applyProductFilter, getAvailableBrands, getOnSaleProducts } from "../utils/catalog";

function OfertasPage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const onSaleProducts = useMemo(() => getOnSaleProducts(products), []);
  const availableBrands = useMemo(() => getAvailableBrands(onSaleProducts), [onSaleProducts]);
  const filteredProducts = useMemo(
    () => applyProductFilter(onSaleProducts, activeFilter),
    [onSaleProducts, activeFilter],
  );

  return (
    <>
      <CategoryPhotoBanner
        image={heroPlayer}
        categoryName="Ofertas"
        tagline="Mejores precios a nuestros mejores clientes."
      />

      <CategoryHero title="Ofertas" subtitle="Descubre nuestra colección completa de ofertas." />

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

export default OfertasPage;
