
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const predefinedResponses: Record<string, string> = {
  "shipping": "We offer nationwide delivery across Nepal with tracking. Standard delivery takes 2-5 days depending on your location.",
  "payment": "We accept Cash on Delivery, eSewa, Khalti and PayPal. All payment methods are secure and protected.",
  "return": "Our return policy allows returns within 7 days of delivery. The product must be unused and in original packaging.",
  "cancel": "You can cancel your order within 24 hours of placing it without any charges.",
  "contact": "You can reach our customer support at support@elegance.com.np or call us at +977-01-XXXXXXX between 10 AM to 6 PM.",
};

const ChatbotSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: "user" | "bot"}[]>([
    {text: "नमस्ते! How can I help you today?", sender: "bot"}
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {text: inputValue, sender: "user"}]);
    
    // Generate response
    setTimeout(() => {
      const response = generateResponse(inputValue);
      setMessages(prev => [...prev, {text: response, sender: "bot"}]);
    }, 600);
    
    setInputValue("");
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check if the query matches any predefined keywords
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowerQuery.includes(keyword)) {
        return response;
      }
    }
    
    // Default responses if no match
    const defaultResponses = [
      "Thank you for your question. Our team will get back to you soon.",
      "I'm sorry, I don't have that information right now. Would you like to speak with a human agent?",
      "That's a great question. Let me connect you with our customer support for more details.",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <>
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-burgundy hover:bg-burgundy-light"
        >
          <MessageCircle size={24} />
        </Button>
      )}
      
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 shadow-lg animate-slide-up">
          <CardHeader className="bg-burgundy text-white pb-2 pt-3 px-4 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium">Elegance Support</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 text-white">
              <X size={16} />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${
                    msg.sender === "bot" 
                      ? "bg-cream self-start" 
                      : "bg-burgundy-light text-white self-end"
                  } rounded-lg p-2 px-3 max-w-[80%]`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..." 
                className="flex-grow"
              />
              <Button type="submit" className="bg-burgundy hover:bg-burgundy-light">
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatbotSupport;
