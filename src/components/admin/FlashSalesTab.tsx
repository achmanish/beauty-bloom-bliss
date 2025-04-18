
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FlashSale } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FlashSalesTabProps {
  flashSales: FlashSale[];
  refreshData?: () => void;
}

const FlashSalesTab = ({ flashSales = [], refreshData }: FlashSalesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flash Sales</h2>
        <Button 
          className="gap-2 bg-purple-600 hover:bg-purple-700 transition-colors"
          onClick={() => {/* To be implemented */}}
        >
          <Plus className="h-4 w-4" />
          Create Flash Sale
        </Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Discount</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableHead className="font-medium">End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flashSales.length > 0 ? (
              flashSales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{sale.name}</TableCell>
                  <TableCell>{sale.discount_percent}%</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(sale.starts_at).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(sale.ends_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No flash sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FlashSalesTab;
