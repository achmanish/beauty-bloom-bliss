
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

const PriceRangeFilter = ({ priceRange, setPriceRange }: PriceRangeFilterProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
      <div className="px-2">
        <Slider
          value={priceRange}
          min={0}
          max={1000}
          step={50}
          onValueChange={setPriceRange}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
