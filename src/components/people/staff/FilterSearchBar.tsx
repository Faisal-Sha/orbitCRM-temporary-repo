
import { FilterOption } from "./types";

interface FilterSearchBarProps {
  filterByValue: string;
  setFilterByValue: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  id: string;
  filterByOptions: FilterOption[];
}

const FilterSearchBar = ({
  filterByValue,
  setFilterByValue,
  search,
  setSearch,
  id,
  filterByOptions,
}: FilterSearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-end justify-between px-1">
      <div className="flex gap-2 items-center">
        <label htmlFor={"filter-by-" + id} className="text-sm font-medium">
          Filter by
        </label>
        <select
          id={"filter-by-" + id}
          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary transition"
          value={filterByValue}
          onChange={(e) => setFilterByValue(e.target.value)}
          style={{ minWidth: 120 }}
        >
          {filterByOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor={"search-staff-" + id} className="text-sm font-medium">
          Search
        </label>
        <input
          id={"search-staff-" + id}
          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary transition"
          style={{ minWidth: 180 }}
          type="text"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterSearchBar;
