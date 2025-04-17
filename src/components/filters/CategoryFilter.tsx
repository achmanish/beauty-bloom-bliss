
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFilterProps {
  categories: {
    name: string;
    value: string;
    count: number;
  }[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategories, toggleCategory }: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center">
            <Checkbox
              id={`category-${category.value}`}
              checked={selectedCategories.includes(category.value)}
              onCheckedChange={() => toggleCategory(category.value)}
            />
            <label
              htmlFor={`category-${category.value}`}
              className="ml-2 text-sm text-gray-700"
            >
              {category.name} ({category.count})
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
