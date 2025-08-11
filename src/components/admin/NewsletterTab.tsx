import { useState, useEffect } from 'react';
import { Mail, Download, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

const NewsletterTab = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch newsletter subscribers',
        variant: 'destructive',
      });
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  };

  const handleUnsubscribe = async (subscriberId: string) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('id', subscriberId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe user',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'User unsubscribed successfully',
      });
      fetchSubscribers();
    }
  };

  const handleDelete = async (subscriberId: string) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', subscriberId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subscriber',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Subscriber deleted successfully',
      });
      fetchSubscribers();
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(sub => sub.is_active);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + 'Email,Subscribed Date,Status\n'
      + activeSubscribers.map(sub => 
          `${sub.email},${new Date(sub.subscribed_at).toLocaleDateString()},${sub.is_active ? 'Active' : 'Inactive'}`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Success',
      description: 'Subscribers exported successfully',
    });
  };

  const activeSubscribers = subscribers.filter(sub => sub.is_active);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Newsletter Subscribers</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-burgundy" />
            <Badge variant="outline">
              {activeSubscribers.length} Active Subscribers
            </Badge>
          </div>
          <Button onClick={exportSubscribers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-burgundy" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold">{subscribers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold">{activeSubscribers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold">{subscribers.length - activeSubscribers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    {subscriber.email}
                  </TableCell>
                  <TableCell>
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={subscriber.is_active ? 'default' : 'secondary'}
                      className={subscriber.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {subscriber.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {subscriber.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.id)}
                          className="text-orange-600 hover:bg-orange-50"
                        >
                          Unsubscribe
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NewsletterTab;