
import { Star, Shield, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
  avatar?: string;
}

const VerifiedReviews = ({ reviews }: { reviews: ReviewProps[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3" />
            <span>Verified Only</span>
          </Badge>
        </div>
      </div>

      {reviews.map((review, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{review.name}</p>
                    {review.verified && (
                      <Badge variant="outline" className="flex items-center h-5 gap-0.5 bg-blue-50 text-blue-700 border-blue-200">
                        <Check className="h-3 w-3" />
                        <span className="text-xs">Verified</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-700">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VerifiedReviews;
