
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Star, MapPin, Package, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export interface SellerProps {
  id: string;
  name: string;
  rating: number;
  location: string;
  productCount: number;
  verified: boolean;
  image?: string;
  joinDate: string;
}

const SellerCard = ({ seller }: { seller: SellerProps }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-40 bg-gradient-to-r from-burgundy to-burgundy-light">
        <div className="absolute -bottom-10 left-4">
          <div className="h-20 w-20 rounded-full bg-white p-1">
            {seller.image ? (
              <img
                src={seller.image}
                alt={seller.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-cream text-burgundy">
                <Store className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="pt-12">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{seller.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-3 w-3" /> {seller.location}
            </div>
          </div>
          <div>
            {seller.verified && (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3" />
                <span>Verified</span>
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-sm">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{seller.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Package className="mr-1 h-4 w-4 text-gray-500" />
            <span>{seller.productCount} products</span>
          </div>
          <div className="text-gray-500">
            Since {seller.joinDate}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 px-4 py-3">
        <Button asChild className="w-full bg-burgundy hover:bg-burgundy-light">
          <Link to={`/seller/${seller.id}`}>Visit Store</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SellerCard;
