
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SearchFilter from "./SearchFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import CategoryFilter from "./CategoryFilter";
import ConcernFilter from "./ConcernFilter";

interface FilterSidebarProps {
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

const FilterSidebar = ({
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
}: FilterSidebarProps) => {
  return (
    <div className="hidden md:block w-1/4 min-w-[250px]">
      <div className="bg-white p-6 rounded-lg border sticky top-24">
        <h2 className="font-medium text-lg mb-6">Filters</h2>
        
        <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />
        
        <Collapsible defaultOpen={true} className="mb-6">
          <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium text-gray-700 mb-2">
            <span>Categories</span>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <CategoryFilter 
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible defaultOpen={true} className="mb-8">
          <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-medium text-gray-700 mb-2">
            <span>Concerns</span>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <ConcernFilter 
              concerns={concerns}
              selectedConcerns={selectedConcerns}
              toggleConcern={toggleConcern}
            />
          </CollapsibleContent>
        </Collapsible>
        
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
  );
};

export default FilterSidebar;
