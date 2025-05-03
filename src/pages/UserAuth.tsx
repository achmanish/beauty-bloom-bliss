
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import AuthForms from '@/components/account/AuthForms';
import { useAuth } from '@/context/AuthContext';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-burgundy hover:text-burgundy-light transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-burgundy">My Account</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <AuthForms 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuth;
