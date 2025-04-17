
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const AdminSearchFilter = ({ searchTerm, setSearchTerm, placeholder = "Search products..." }: AdminSearchFilterProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default AdminSearchFilter;
