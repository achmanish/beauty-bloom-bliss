
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderConfirmationLayoutProps {
  children: ReactNode;
}

const OrderConfirmationLayout = ({ children }: OrderConfirmationLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-4 pb-16">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationLayout;
