
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-burgundy mb-6 text-center">
            About Élégance
          </h1>
          
          <div className="bg-cream-light p-6 rounded-lg shadow-sm mb-10 animate-fade-in">
            <h2 className="font-playfair text-2xl text-burgundy mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Élégance, your premier destination for luxury beauty and skincare products in Nepal. 
              Founded with a passion for beauty and wellness, we've curated a collection of the world's finest 
              cosmetic brands to bring you an unparalleled beauty experience.
            </p>
            <p className="text-gray-700 mb-4">
              At Élégance, we believe that beauty is more than skin deep. It's about confidence, self-care, 
              and expressing your unique identity. That's why we've made it our mission to provide you with 
              only genuine, high-quality products that enhance your natural beauty.
            </p>
            <p className="text-gray-700">
              From prestigious international labels to emerging cult favorites, our collection represents the 
              best in skincare, makeup, haircare, and body products. We meticulously select each item, ensuring 
              authenticity and excellence in every purchase.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div className="bg-cream-light p-6 rounded-lg shadow-sm animate-fade-in">
              <h2 className="font-playfair text-2xl text-burgundy mb-4">Our Promise</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-rose inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"></span>
                  <span>100% authentic products directly from official brands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Thoughtfully curated selection for all skin types and concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Expert beauty advice from our trained consultants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Safe and secure shopping experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-rose inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Dedicated customer service</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-cream-light p-6 rounded-lg shadow-sm animate-fade-in">
              <h2 className="font-playfair text-2xl text-burgundy mb-4">Featured Brands</h2>
              <p className="text-gray-700 mb-4">
                We're proud to offer a diverse range of premium beauty brands, including:
              </p>
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div className="border border-rose rounded p-2 text-center">La Mer</div>
                <div className="border border-rose rounded p-2 text-center">Estée Lauder</div>
                <div className="border border-rose rounded p-2 text-center">SK-II</div>
                <div className="border border-rose rounded p-2 text-center">Chanel</div>
                <div className="border border-rose rounded p-2 text-center">Dior</div>
                <div className="border border-rose rounded p-2 text-center">Clarins</div>
              </div>
            </div>
          </div>
          
          <div className="bg-burgundy text-white p-6 rounded-lg shadow-sm mb-10 animate-fade-in">
            <h2 className="font-playfair text-2xl mb-4">Visit Our Store</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="mb-4">
                  Experience our products in person and receive personalized consultations from our beauty experts.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>Basundhara, Kathmandu, Nepal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>+977 1 4123456</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>info@elegance.com.np</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg mb-2">Store Hours:</h3>
                  <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: 12:00 PM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg mb-2">Follow Us</h3>
                  <div className="flex gap-4 mb-6">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-light transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-light transition-colors">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-light transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                <div>
                  <Link to="/contact">
                    <Button className="w-full bg-rose hover:bg-rose-dark text-burgundy font-medium">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="font-playfair text-2xl text-burgundy mb-4">Ready to Discover Your Perfect Products?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="default" className="bg-burgundy hover:bg-burgundy-light">
                  Shop Now
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-burgundy text-burgundy hover:bg-cream">
                  Join Élégance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
