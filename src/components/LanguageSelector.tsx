
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'ne';

interface Translation {
  [key: string]: {
    en: string;
    ne: string;
  };
}

// Basic translations
const translations: Translation = {
  // Navbar
  shopAll: { en: 'Shop All', ne: 'सबै प्रोडक्टहरू' },
  categories: { en: 'Categories', ne: 'श्रेणीहरू' },
  bestsellers: { en: 'Bestsellers', ne: 'सर्वाधिक बिक्री' },
  marketplace: { en: 'Marketplace', ne: 'बजार' },
  about: { en: 'About', ne: 'हाम्रो बारेमा' },
  contact: { en: 'Contact', ne: 'सम्पर्क' },
  
  // Categories
  skincare: { en: 'Skincare', ne: 'स्किन केयर' },
  makeup: { en: 'Makeup', ne: 'मेकअप' },
  haircare: { en: 'Hair Care', ne: 'हेयर केयर' },
  bodycare: { en: 'Body Care', ne: 'बडी केयर' },
  
  // Account
  myAccount: { en: 'My Account', ne: 'मेरो खाता' },
  myOrders: { en: 'My Orders', ne: 'मेरो अर्डरहरू' },
  adminDashboard: { en: 'Admin Dashboard', ne: 'एडमिन ड्यासबोर्ड' },
  signOut: { en: 'Sign Out', ne: 'लगआउट' },
  signIn: { en: 'Sign In', ne: 'लगइन' },
  register: { en: 'Register', ne: 'दर्ता गर्नुहोस्' },
  
  // Search
  searchProducts: { en: 'Search Products', ne: 'उत्पादनहरू खोज्नुहोस्' },
  search: { en: 'Search', ne: 'खोज्नुहोस्' },
  suggestions: { en: 'Suggestions', ne: 'सुझावहरू' },
  noProducts: { en: 'No products match your search', ne: 'तपाईंको खोजसँग मिल्ने कुनै उत्पादन छैन' },

  // Hero section
  discoverBeauty: { en: 'Discover Your Natural Beauty', ne: 'तपाईंको प्राकृतिक सौन्दर्य पत्ता लगाउनुहोस्' },
  luxurySkincare: { en: 'Luxury skincare and cosmetics made with natural ingredients for a radiant, confident you.', 
                    ne: 'प्राकृतिक सामग्रीहरूले बनाइएको डिलक्स स्किनकेयर र कस्मेटिक्स तपाईंको चमकदार र आत्मविश्वासी रूपका लागि।' },
  shopNow: { en: 'Shop Now', ne: 'किन्नुहोस्' },
  learnMore: { en: 'Learn More', ne: 'थप जान्नुहोस्' },
  
  // Cart
  yourCart: { en: 'Your Shopping Cart', ne: 'तपाईंको शपिङ कार्ट' },
  emptyCart: { en: 'Your cart is empty', ne: 'तपाइँको कार्ट खाली छ' },
  continueShopping: { en: 'Continue Shopping', ne: 'किनमेल जारी राख्नुहोस्' },
  addToCart: { en: 'Add to Cart', ne: 'कार्टमा थप्नुहोस्' },
  
  // Checkout
  checkout: { en: 'Checkout', ne: 'चेकआउट' },
  shippingDetails: { en: 'Shipping Details', ne: 'डेलिभरी विवरण' },
  payment: { en: 'Payment', ne: 'भुक्तानी' },
  orderSummary: { en: 'Order Summary', ne: 'अर्डर सारांश' },
  fullName: { en: 'Full Name', ne: 'पूरा नाम' },
  email: { en: 'Email', ne: 'इमेल' },
  phone: { en: 'Phone', ne: 'फोन' },
  address: { en: 'Address', ne: 'ठेगाना' },
  city: { en: 'City', ne: 'शहर' },
  zipCode: { en: 'ZIP Code', ne: 'जिप कोड' },
  orderNotes: { en: 'Order Notes', ne: 'अर्डर नोटहरू' },
  processing: { en: 'Processing...', ne: 'प्रक्रिया हुँदैछ...' },
  continueToPayment: { en: 'Continue to Payment', ne: 'भुक्तानीमा जारी राख्नुहोस्' },
  subtotal: { en: 'Subtotal', ne: 'सबटोटल' },
  shipping: { en: 'Shipping', ne: 'डेलिभरी शुल्क' },
  totalAmount: { en: 'Total Amount', ne: 'जम्मा रकम' },
  free: { en: 'Free', ne: 'नि:शुल्क' },
  
  // Payment
  selectPaymentMethod: { en: 'Select Payment Method', ne: 'भुक्तानी विधि चयन गर्नुहोस्' },
  khalti: { en: 'Khalti', ne: 'खल्ती' },
  esewa: { en: 'eSewa', ne: 'इसेवा' },
  payNow: { en: 'Pay Now', ne: 'अहिले भुक्तानी गर्नुहोस्' },
  processingPayment: { en: 'Processing Payment...', ne: 'भुक्तानी प्रक्रिया गरिंदै...' },
};

// Create a context for language
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  const translate = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][currentLanguage];
  };

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    // Dispatch a custom event so other components can react to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  };

  return { currentLanguage, translate, changeLanguage };
};

const languageLabels: Record<Language, string> = {
  en: 'English',
  ne: 'नेपाली',
};

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    // Apply translations without requiring page reload
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-burgundy">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={currentLanguage === lang ? "font-bold bg-cream-dark" : ""}
          >
            {languageLabels[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
