
import { Slider } from "@/components/ui/slider";

interface AdminPriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const AdminPriceRangeFilter = ({ priceRange, setPriceRange }: AdminPriceRangeFilterProps) => {
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm font-medium mb-1 block">
        Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
      </label>
      <Slider
        defaultValue={[0, 10000]}
        max={10000}
        step={100}
        value={priceRange}
        onValueChange={setPriceRange}
        className="mt-2"
      />
    </div>
  );
};

export default AdminPriceRangeFilter;
