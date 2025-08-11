import { useState, useEffect } from 'react';
import { Star, StarOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: string;
  user_id: string;
  verified_purchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn || !user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to write a review',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Review submitted',
        description: 'Thank you for your review!',
      });
      setShowForm(false);
      setRating(0);
      setTitle('');
      setComment('');
      fetchReviews();
    }

    setIsSubmitting(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>
        
        {isLoggedIn && (
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant="outline"
          >
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Write your review</h4>
          
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            {renderStars(rating, true, setRating)}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary of your review"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Review (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product"
              rows={4}
              maxLength={500}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  {review.title && (
                    <h5 className="font-medium mb-1">{review.title}</h5>
                  )}
                  
                  {review.comment && (
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;