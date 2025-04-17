
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminCategoryFilterProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
}

const AdminCategoryFilter = ({ categoryFilter, setCategoryFilter, categories }: AdminCategoryFilterProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Category</label>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminCategoryFilter;
