
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

const PriceRangeFilter = ({ priceRange, setPriceRange }: PriceRangeFilterProps) => {
  // Added local state to handle and display changes immediately
  const [localRange, setLocalRange] = useState<number[]>(priceRange);
  
  // Update local state when props change
  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);
  
  // Handle slider change
  const handleChange = (value: number[]) => {
    setLocalRange(value);
    setPriceRange(value);
  };
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
      <div className="px-2">
        <Slider
          value={localRange}
          min={0}
          max={1000}
          step={50}
          onValueChange={handleChange}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>${localRange[0]}</span>
        <span>${localRange[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
