
import { FilterSearchBarProps } from "./types";

const FilterSearchBar = ({
  filterId,
  searchId,
  filterBy,
  setFilterBy,
  searchTerm,
  setSearchTerm,
  filterByOptions,
}: FilterSearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-end justify-between px-1">
      <div className="flex gap-2 items-center">
        <label htmlFor={filterId} className="text-sm font-medium">Filter by</label>
        <select
          id={filterId}
          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary transition"
          value={filterBy}
          onChange={e => setFilterBy(e.target.value)}
          style={{ minWidth: 120 }}
        >
          {filterByOptions.map(opt =>
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )}
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor={searchId} className="text-sm font-medium">Search</label>
        <input
          id={searchId}
          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary transition"
          style={{ minWidth: 180 }}
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterSearchBar;
