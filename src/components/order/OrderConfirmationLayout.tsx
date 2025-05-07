
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
      {children}
      <Footer />
    </div>
  );
};

export default OrderConfirmationLayout;
