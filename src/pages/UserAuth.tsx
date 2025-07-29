
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import AuthForms from '@/components/account/AuthForms';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Shield, Heart, Star } from 'lucide-react';

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to account page
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/account');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-light to-cream relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A1D1F' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-burgundy/10 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-rose/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-burgundy/5 rounded-full blur-xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy-light transition-all duration-300 mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Élégance</span>
            </Link>
            
            <div className="mb-4">
              <h1 className="font-playfair text-4xl font-bold text-burgundy mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                {activeTab === 'login' 
                  ? 'Sign in to your beauty journey' 
                  : 'Start your beauty journey with us'
                }
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-burgundy" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-burgundy" />
                <span>Trusted</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-burgundy" />
                <span>Premium</span>
              </div>
            </div>
          </div>
          
          {/* Auth Card */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-burgundy/10">
            <CardContent className="p-8">
              <AuthForms 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-burgundy hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-burgundy hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
