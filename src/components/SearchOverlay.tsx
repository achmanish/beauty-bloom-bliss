
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/productData";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filteredProducts = allProducts
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map(product => ({ id: String(product.id), name: product.name }));
      
      setSuggestions(filteredProducts);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/product/${id}`);
    onClose();
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 md:pt-32 px-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="text-lg font-medium">Search Products</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              ref={inputRef}
              type="text" 
              placeholder="Search for products..." 
              className="pl-10 w-full text-lg py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          {suggestions.length > 0 && (
            <div className="mt-4 border-t pt-2">
              <p className="text-sm text-gray-500 mb-2">Suggestions</p>
              <ul>
                {suggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      className="w-full text-left p-2 hover:bg-cream rounded-md flex items-center gap-2 transition-colors"
                      onClick={() => handleSuggestionClick(item.id)}
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchQuery.trim().length > 1 && suggestions.length === 0 && (
            <div className="mt-4 text-center py-4 text-gray-500">
              No products match your search
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={handleSearch}
              className="bg-burgundy hover:bg-burgundy-light text-white"
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
