import { useMemo, useState } from "react";
import SearchBar from "../components/search/SearchBar";
import ProductFilters, { type ActiveFilter } from "../components/category/ProductFilters";
import ProductGrid from "../components/category/ProductGrid";
import { useProducts } from "../context/ProductsContext";
import { shuffle } from "../utils/array";
import {
  PRICE_BUCKETS,
  applyProductFilter,
  getAvailableBrands,
  getAvailablePriceBuckets,
  searchProducts,
} from "../utils/catalog";
import "./SearchPage.css";

const priceLabels = Object.fromEntries(PRICE_BUCKETS.map((bucket) => [bucket.value, bucket.label]));

function SearchPage() {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  const randomPool = useMemo(() => shuffle(products), [products]);
  const searchResults = useMemo(() => searchProducts(randomPool, query), [randomPool, query]);

  const availableBrands = useMemo(() => getAvailableBrands(searchResults), [searchResults]);
  const availablePriceBuckets = useMemo(
    () => getAvailablePriceBuckets(searchResults),
    [searchResults],
  );

  const filteredResults = useMemo(
    () => applyProductFilter(searchResults, activeFilter),
    [searchResults, activeFilter],
  );

  return (
    <div className="search-page">
      <div className="container">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <ProductFilters
        groups={[
          { type: "brand", options: availableBrands },
          { type: "price", options: availablePriceBuckets, labels: priceLabels },
        ]}
        activeFilter={activeFilter}
        onSelect={setActiveFilter}
      />

      <ProductGrid
        products={filteredResults}
        variant="search"
        emptyMessage={
          query
            ? `No encontramos productos para "${query}".`
            : "No hay productos disponibles con este filtro por el momento."
        }
      />
    </div>
  );
}

export default SearchPage;
