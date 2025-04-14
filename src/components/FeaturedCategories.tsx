
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    description: "Nourish and protect your skin with our premium skincare collection",
    link: "/category/skincare"
  },
  {
    name: "Makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "Enhance your natural beauty with our luxurious makeup products",
    link: "/category/makeup"
  },
  {
    name: "Hair Care",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
    description: "Revitalize and strengthen your hair with our botanical formulas",
    link: "/category/hair"
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair text-4xl text-center mb-12 text-burgundy">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="font-playfair text-2xl mb-2">{category.name}</h3>
                <p className="mb-4 text-white/80 text-sm">{category.description}</p>
                <Link 
                  to={category.link}
                  className="inline-block bg-white/20 hover:bg-white/40 transition-colors text-white rounded-full px-6 py-2 backdrop-blur-sm self-start"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
