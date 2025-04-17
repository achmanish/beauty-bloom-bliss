
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchFilter from "./SearchFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import CategoryFilter from "./CategoryFilter";
import ConcernFilter from "./ConcernFilter";

interface MobileFilterDrawerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  categories: { name: string; value: string; count: number }[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  concerns: { name: string; value: string; count: number }[];
  selectedConcerns: string[];
  toggleConcern: (concern: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const MobileFilterDrawer = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  categories,
  selectedCategories,
  toggleCategory,
  concerns,
  selectedConcerns,
  toggleConcern,
  applyFilters,
  resetFilters
}: MobileFilterDrawerProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="flex items-center text-burgundy"
      >
        <Filter className="w-5 h-5 mr-2" />
        Filters
      </button>
      
      {filtersOpen && (
        <div className="md:hidden mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />
            <CategoryFilter 
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
            <ConcernFilter 
              concerns={concerns}
              selectedConcerns={selectedConcerns}
              toggleConcern={toggleConcern}
            />
            
            <div className="flex space-x-2">
              <Button
                className="bg-burgundy hover:bg-burgundy-light text-white flex-grow"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="border-burgundy text-burgundy"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterDrawer;
