
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SellerCard, { SellerProps } from '@/components/SellerCard';
import { Separator } from '@/components/ui/separator';

// Mock data for sellers
const sellers: SellerProps[] = [
  {
    id: '1',
    name: 'Nepali Handicrafts',
    rating: 4.8,
    location: 'Kathmandu',
    productCount: 78,
    verified: true,
    joinDate: 'Apr 2022',
  },
  {
    id: '2',
    name: 'Himalayan Treasures',
    rating: 4.7,
    location: 'Pokhara',
    productCount: 62,
    verified: true,
    joinDate: 'Jun 2022',
  },
  {
    id: '3',
    name: 'Mountain Spices',
    rating: 4.5,
    location: 'Lalitpur',
    productCount: 41,
    verified: true,
    joinDate: 'Mar 2023',
  },
  {
    id: '4',
    name: 'Nepal Tea House',
    rating: 4.9,
    location: 'Ilam',
    productCount: 36,
    verified: true,
    joinDate: 'Jan 2022',
  },
  {
    id: '5',
    name: 'Pashmina Collection',
    rating: 4.6,
    location: 'Bhaktapur',
    productCount: 54,
    verified: true,
    joinDate: 'Sep 2022',
  },
  {
    id: '6',
    name: 'Sherpa Outdoors',
    rating: 4.7,
    location: 'Solukhumbu',
    productCount: 29,
    verified: false,
    joinDate: 'Nov 2023',
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredSellers = sellers.filter(seller => {
    if (searchQuery && !seller.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedLocation && seller.location !== selectedLocation) {
      return false;
    }
    return true;
  });

  const locations = [...new Set(sellers.map(seller => seller.location))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-burgundy mb-2">Nepal's Finest Sellers</h1>
        <p className="text-gray-600">Discover authentic products from verified Nepali sellers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sellers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full md:w-[200px]">
            <div className="flex items-center">
              {selectedLocation ? (
                <>
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Filter by location" />
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Filter by location</span>
                </>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-locations">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No sellers found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <Separator className="my-12" />
      
      <div className="bg-cream rounded-lg p-6 text-center">
        <h2 className="font-playfair text-2xl font-bold text-burgundy mb-4">Become a Seller</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our growing marketplace and showcase your products to customers across Nepal. Enjoy competitive fees and reach a wider audience.
        </p>
        <Button asChild className="bg-burgundy hover:bg-burgundy-light">
          <Link to="/become-seller">Apply Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Marketplace;
