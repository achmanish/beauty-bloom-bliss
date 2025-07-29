import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";

interface AuthFormsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthForms = ({ activeTab, setActiveTab }: AuthFormsProps) => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      
      if (error) throw error;
      
      toast.success("Successfully logged in! Welcome back!");
      window.location.href = '/';
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerFirstName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: registerFirstName,
            last_name: registerLastName
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully! Please check your email for verification.");
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-accent/50 backdrop-blur-sm border border-burgundy/10">
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-burgundy data-[state=active]:text-white transition-all duration-300"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger 
            value="register"
            className="data-[state=active]:bg-burgundy data-[state=active]:text-white transition-all duration-300"
          >
            Create Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-burgundy">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10 h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-burgundy">
                  Password
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-burgundy hover:text-burgundy-light transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-burgundy transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-burgundy/30 data-[state=checked]:bg-burgundy" />
              <label htmlFor="remember" className="text-sm text-muted-foreground select-none">
                Keep me signed in
              </label>
            </div>
            
            {/* Sign In Button */}
            <Button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full h-12 bg-gradient-to-r from-burgundy to-burgundy-light hover:from-burgundy-light hover:to-burgundy text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing you in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sign In to Élégance
                </div>
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register" className="mt-0">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-burgundy">
                  First Name*
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="firstName" 
                    placeholder="First name"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    className="pl-10 h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-burgundy">
                  Last Name
                </Label>
                <Input 
                  id="lastName" 
                  placeholder="Last name"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                  className="h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="text-sm font-medium text-burgundy">
                Email Address*
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="registerEmail" 
                  type="email" 
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="pl-10 h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="text-sm font-medium text-burgundy">
                Password*
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="registerPassword" 
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-burgundy/20 focus:border-burgundy focus:ring-burgundy/20 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-burgundy transition-colors"
                >
                  {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters with numbers and special characters
              </p>
            </div>
            
            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                required 
                className="border-burgundy/30 data-[state=checked]:bg-burgundy mt-1" 
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed select-none">
                I agree to the{" "}
                <Link to="/terms" className="text-burgundy hover:underline font-medium">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-burgundy hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            {/* Create Account Button */}
            <Button 
              type="submit" 
              disabled={isRegistering}
              className="w-full h-12 bg-gradient-to-r from-burgundy to-burgundy-light hover:from-burgundy-light hover:to-burgundy text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating your account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Join Élégance Today
                </div>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForms;