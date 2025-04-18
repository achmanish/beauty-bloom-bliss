
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface AdminPriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const AdminPriceRangeFilter = ({ priceRange, setPriceRange }: AdminPriceRangeFilterProps) => {
  const [localRange, setLocalRange] = useState(priceRange);
  
  useEffect(() => {
    // Update local state when props change
    setLocalRange(priceRange);
  }, [priceRange]);
  
  const handleChange = (values: number[]) => {
    setLocalRange(values);
    setPriceRange(values);
  };
  
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm font-medium mb-1 block">
        Price Range: ₹{localRange[0].toLocaleString('ne-NP')} - ₹{localRange[1].toLocaleString('ne-NP')}
      </label>
      <Slider
        defaultValue={[0, 10000]}
        max={10000}
        step={100}
        value={localRange}
        onValueChange={handleChange}
        className="mt-2"
      />
    </div>
  );
};

export default AdminPriceRangeFilter;
