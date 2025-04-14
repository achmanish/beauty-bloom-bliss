
import { TruckIcon, Shield, LeafIcon, BadgeCheck } from "lucide-react";

const benefits = [
  {
    icon: TruckIcon,
    title: "Free Shipping",
    description: "On all orders over $50"
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions"
  },
  {
    icon: LeafIcon,
    title: "Eco-Friendly",
    description: "Sustainable packaging"
  },
  {
    icon: BadgeCheck,
    title: "Quality Guarantee",
    description: "Cruelty-free products"
  }
];

const BenefitsBanner = () => {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center">
              <div className="mr-4 bg-rose rounded-full p-3">
                <benefit.icon className="h-6 w-6 text-burgundy" />
              </div>
              <div>
                <h3 className="font-playfair text-lg text-burgundy">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBanner;
