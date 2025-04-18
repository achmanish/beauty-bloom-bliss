
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search, MoreHorizontal, Mail, Phone, MapPin, User, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Dummy customers data for demonstration
const DUMMY_CUSTOMERS = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+977 98-1234-5678",
    address: "Kathmandu, Nepal",
    orders: 5,
    totalSpent: 15950,
    lastOrder: "2025-04-10"
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+977 98-2345-6789",
    address: "Pokhara, Nepal",
    orders: 3,
    totalSpent: 8750,
    lastOrder: "2025-04-05"
  },
  {
    id: "3",
    name: "Rohan Thapa",
    email: "rohan.thapa@example.com",
    phone: "+977 98-3456-7890",
    address: "Lalitpur, Nepal",
    orders: 8,
    totalSpent: 23600,
    lastOrder: "2025-04-15"
  },
  {
    id: "4",
    name: "Sita Gurung",
    email: "sita.gurung@example.com",
    phone: "+977 98-4567-8901",
    address: "Bhaktapur, Nepal",
    orders: 2,
    totalSpent: 5200,
    lastOrder: "2025-03-22"
  },
  {
    id: "5",
    name: "Anish Shrestha",
    email: "anish.shrestha@example.com",
    phone: "+977 98-5678-9012",
    address: "Biratnagar, Nepal",
    orders: 6,
    totalSpent: 18900,
    lastOrder: "2025-04-08"
  }
];

const CustomersTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState(DUMMY_CUSTOMERS);
  const { toast } = useToast();
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Simulate refresh
  const handleRefresh = () => {
    toast({
      title: "Data refreshed",
      description: "Customer data has been updated."
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{customers.filter(c => c.orders > 0).length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('ne-NP')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Contact</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Orders</TableHead>
              <TableHead className="font-medium">Total Spent</TableHead>
              <TableHead className="font-medium">Last Order</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3.5 w-3.5 text-gray-500 mr-1" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-3.5 w-3.5 text-gray-500 mr-1" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1" />
                      {customer.address}
                    </div>
                  </TableCell>
                  
                  <TableCell>{customer.orders}</TableCell>
                  
                  <TableCell>₹{customer.totalSpent.toLocaleString('ne-NP')}</TableCell>
                  
                  <TableCell>
                    {new Date(customer.lastOrder).toLocaleDateString('ne-NP')}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersTab;
