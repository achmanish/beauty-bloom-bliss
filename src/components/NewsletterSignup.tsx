import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubscribing(true);

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already subscribed',
          description: 'This email is already subscribed to our newsletter',
        });
      } else {
        toast({
          title: 'Subscription failed',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Welcome!',
        description: 'You have been successfully subscribed to our newsletter',
      });
      setEmail('');
    }

    setIsSubscribing(false);
  };

  return (
    <div className="bg-gradient-to-r from-burgundy to-burgundy-dark text-white p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Stay Updated</h3>
      </div>
      
      <p className="text-burgundy-light mb-4">
        Subscribe to our newsletter for exclusive deals, beauty tips, and new product launches.
      </p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white text-gray-900 border-none"
          disabled={isSubscribing}
        />
        <Button
          type="submit"
          disabled={isSubscribing}
          className="bg-white text-burgundy hover:bg-cream hover:text-burgundy-dark font-medium"
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;