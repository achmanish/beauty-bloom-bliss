
import { Button } from "@/components/ui/button";
import { Check, Plus, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Address {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

interface AddressListProps {
  addresses: Address[];
  isLoadingAddresses: boolean;
  onSetDefaultAddress: (addressId: string) => Promise<void>;
  onRemoveAddress: (addressId: string) => Promise<void>;
}

const AddressList = ({
  addresses,
  isLoadingAddresses,
  onSetDefaultAddress,
  onRemoveAddress
}: AddressListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        
        <Button className="bg-burgundy hover:bg-burgundy-light">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {isLoadingAddresses ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading your addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border p-8">
          <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add an address for faster checkout</p>
          <Button className="bg-burgundy hover:bg-burgundy-light">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={`${address.is_default ? 'border-burgundy' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{address.name}</h3>
                  {address.is_default && (
                    <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Default
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                {!address.is_default && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => onSetDefaultAddress(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
                {address.is_default ? (
                  <div className="w-20"></div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-red-500 hover:text-red-700"
                    onClick={() => onRemoveAddress(address.id)}
                  >
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
