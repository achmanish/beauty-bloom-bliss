
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchFilter = ({ searchQuery, setSearchQuery }: SearchFilterProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    // Update the internal state when the prop changes
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
      <Input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default SearchFilter;
