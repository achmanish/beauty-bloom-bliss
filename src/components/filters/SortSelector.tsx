
import { ChevronDown } from "lucide-react";

interface SortSelectorProps {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

const SortSelector = ({ sortBy, setSortBy }: SortSelectorProps) => {
  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 rounded-md p-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-burgundy"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="newest">Newest</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
    </div>
  );
};

export default SortSelector;
