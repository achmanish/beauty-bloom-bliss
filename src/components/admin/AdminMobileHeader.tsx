
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminMobileHeaderProps {
  onLogout: () => void;
}

const AdminMobileHeader = ({ onLogout }: AdminMobileHeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-burgundy flex items-center">
          <LayoutDashboard className="h-5 w-5 mr-2" />
          Admin Panel
        </h2>
        <Button 
          variant="outline" 
          onClick={onLogout} 
          size="sm"
          className="hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminMobileHeader;
