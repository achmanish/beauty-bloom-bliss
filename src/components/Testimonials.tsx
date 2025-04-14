
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Emma Wilson",
    role: "Skincare Enthusiast",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    content: "I've tried dozens of skincare brands, but nothing compares to the quality and results I've seen with Élégance. Their Rose Glow Serum has completely transformed my skin!",
    rating: 5
  },
  {
    name: "Sophie Miller",
    role: "Beauty Blogger",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
    content: "The Hydrating Cream is worth every penny. My skin feels nourished and plump, and the scent is divine. I've been recommending it to all my followers.",
    rating: 5
  },
  {
    name: "Olivia Taylor",
    role: "Makeup Artist",
    image: "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&w=200&q=80",
    content: "As a professional makeup artist, I need products that deliver consistent results. The Crystal Essence creates the perfect base for makeup application.",
    rating: 4
  },
  {
    name: "Jessica Chen",
    role: "Customer",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
    content: "I've been using the Renewal Oil for three months now, and the difference in my skin's texture and tone is remarkable. So glad I discovered this brand!",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair text-4xl text-center mb-4 text-burgundy">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Read genuine reviews from our customers who have experienced the transformation with our products.
        </p>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-none shadow-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4" 
                      />
                      <div>
                        <h4 className="font-playfair font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 flex-grow mb-4 italic">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
