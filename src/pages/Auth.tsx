
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select()
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (adminError || !adminData) {
        // If not an admin, sign them out
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex items-center justify-between bg-white p-4 shadow-sm">
        <Link to="/" className="flex items-center text-burgundy hover:text-burgundy-light">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Store
        </Link>
      </div>
      
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <Shield className="h-12 w-12 text-burgundy" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Store Admin Access</CardTitle>
              <CardDescription className="text-center">
                This area is restricted to store administrators only.
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                  <strong>Note:</strong> Regular customers should not use this page. 
                  To access your wishlist, please use the wishlist icon in the navigation menu.
                </div>
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy-light" disabled={loading}>
                  {loading ? "Logging in..." : "Admin Login"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  For demo purposes, try: admin@elegance.com / admin123
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
