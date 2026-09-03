import "./ProductFilters.css";

export interface ActiveFilter {
  type: string;
  value: string;
}

export interface FilterGroup {
  type: string;
  options: string[];
}

interface ProductFiltersProps {
  groups: FilterGroup[];
  activeFilter: ActiveFilter | null;
  onSelect: (filter: ActiveFilter | null) => void;
}

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

function formatOptionLabel(type: string, value: string): string {
  if (type === "level") return levelLabels[value] ?? value;
  return value;
}

function ProductFilters({ groups, activeFilter, onSelect }: ProductFiltersProps) {
  const visibleGroups = groups.filter((group) => group.options.length > 0);

  if (visibleGroups.length === 0) return null;

  return (
    <div className="product-filters container">
      {visibleGroups.map((group, groupIndex) => (
        <div className="product-filters__row" key={group.type}>
          {groupIndex === 0 && (
            <button
              type="button"
              className={`filter-pill${activeFilter === null ? " filter-pill--active" : ""}`}
              onClick={() => onSelect(null)}
            >
              Todas
            </button>
          )}

          {group.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-pill${
                activeFilter?.type === group.type && activeFilter.value === option
                  ? " filter-pill--active"
                  : ""
              }`}
              onClick={() => onSelect({ type: group.type, value: option })}
            >
              {formatOptionLabel(group.type, option)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ProductFilters;
