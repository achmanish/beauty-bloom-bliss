
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-burgundy mb-6 text-center">
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-cream-light p-6 rounded-lg shadow-sm animate-fade-in">
              <h2 className="font-playfair text-2xl text-burgundy mb-4">Get In Touch</h2>
              <p className="text-gray-700 mb-6">
                Have questions about our products or services? Looking for beauty advice? 
                We'd love to hear from you! Reach out to us using the information below.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-burgundy flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Our Location</h3>
                    <p className="text-gray-700">Basundhara, Kathmandu, Nepal</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1 text-burgundy flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-700">+977 1 4123456</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-burgundy flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-700">info@elegance.com.np</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Store Hours:</h3>
                <p className="text-gray-700">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                <p className="text-gray-700">Sunday: 12:00 PM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="bg-cream-light p-6 rounded-lg shadow-sm animate-fade-in">
              <h2 className="font-playfair text-2xl text-burgundy mb-4">Send Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input id="name" type="text" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input id="email" type="email" required />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input id="subject" type="text" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea id="message" rows={4} required />
                </div>
                
                <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-light">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          
          <div className="bg-rose p-6 rounded-lg shadow-sm mb-10 animate-fade-in">
            <h2 className="font-playfair text-2xl text-burgundy mb-4 text-center">Visit Our Store</h2>
            <p className="text-gray-700 text-center mb-4">
              Experience our products in person and receive personalized beauty consultations.
            </p>
            {/* This would be an embedded map in a real implementation */}
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive Map Would Be Displayed Here</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
