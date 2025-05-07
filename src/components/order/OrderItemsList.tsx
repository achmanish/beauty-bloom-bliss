
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-cream">
            <TableHead className="text-burgundy">Product</TableHead>
            <TableHead className="text-center text-burgundy">Quantity</TableHead>
            <TableHead className="text-right text-burgundy">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-b">
              <TableCell className="px-4 py-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-center">{item.quantity}</TableCell>
              <TableCell className="px-4 py-4 text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemsList;
