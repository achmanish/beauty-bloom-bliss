import { useState, useEffect } from 'react';
import { Star, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      fetchReviews();
    }
  };

  const toggleVerifiedPurchase = async (reviewId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('reviews')
      .update({ verified_purchase: !currentStatus })
      .eq('id', reviewId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });
      fetchReviews();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

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
        <h2 className="text-2xl font-semibold">Reviews Management</h2>
        <Badge variant="outline">
          {reviews.length} Total Reviews
        </Badge>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="max-w-48 truncate">
                    {review.product_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">({review.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 truncate">
                    {review.title || 'No title'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={review.verified_purchase ? 'default' : 'secondary'}
                      className={review.verified_purchase ? 'bg-green-100 text-green-800' : ''}
                    >
                      {review.verified_purchase ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Rating:</label>
                              {renderStars(review.rating)}
                            </div>
                            {review.title && (
                              <div>
                                <label className="text-sm font-medium">Title:</label>
                                <p className="mt-1">{review.title}</p>
                              </div>
                            )}
                            {review.comment && (
                              <div>
                                <label className="text-sm font-medium">Comment:</label>
                                <p className="mt-1">{review.comment}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium">Product ID:</label>
                              <p className="mt-1 font-mono text-xs">{review.product_id}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">User ID:</label>
                              <p className="mt-1 font-mono text-xs">{review.user_id}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVerifiedPurchase(review.id, review.verified_purchase)}
                        className={review.verified_purchase ? 'text-red-600' : 'text-green-600'}
                      >
                        {review.verified_purchase ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
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

export default ReviewsTab;