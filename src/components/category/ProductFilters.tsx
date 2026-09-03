import type { PlayerLevel } from "../../types/product";
import "./ProductFilters.css";

export interface ActiveFilter {
  type: "brand" | "level";
  value: string;
}

interface ProductFiltersProps {
  brands: string[];
  levels: PlayerLevel[];
  activeFilter: ActiveFilter | null;
  onSelect: (filter: ActiveFilter | null) => void;
}

const levelLabels: Record<PlayerLevel, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

function ProductFilters({ brands, levels, activeFilter, onSelect }: ProductFiltersProps) {
  return (
    <div className="product-filters container">
      <div className="product-filters__row">
        <button
          type="button"
          className={`filter-pill${activeFilter === null ? " filter-pill--active" : ""}`}
          onClick={() => onSelect(null)}
        >
          Todas
        </button>

        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            className={`filter-pill${
              activeFilter?.type === "brand" && activeFilter.value === brand
                ? " filter-pill--active"
                : ""
            }`}
            onClick={() => onSelect({ type: "brand", value: brand })}
          >
            {brand}
          </button>
        ))}
      </div>

      {levels.length > 0 && (
        <div className="product-filters__row">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              className={`filter-pill${
                activeFilter?.type === "level" && activeFilter.value === level
                  ? " filter-pill--active"
                  : ""
              }`}
              onClick={() => onSelect({ type: "level", value: level })}
            >
              {levelLabels[level]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductFilters;
