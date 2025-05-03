
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/auth" className="text-burgundy hover:text-burgundy-light transition-colors">
            &larr; Back to Login
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-burgundy">Forgot Password</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center py-4">
                <h2 className="text-xl font-medium mb-4">Email Sent</h2>
                <p className="mb-6 text-gray-600">
                  We've sent password reset instructions to {email}. Please check your inbox.
                </p>
                <p className="text-sm text-gray-500">
                  If you don't see the email, check your spam folder or{" "}
                  <button 
                    type="button" 
                    onClick={() => setIsSubmitted(false)}
                    className="text-burgundy hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-burgundy hover:bg-burgundy-light text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Remember your password?{" "}
                    <Link to="/auth" className="text-burgundy hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
