
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Gift, TrendingUp } from "lucide-react";

interface LoyaltyProgramProps {
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  pointsToNextTier: number;
}

const tierColors = {
  Bronze: "bg-amber-700",
  Silver: "bg-gray-400",
  Gold: "bg-yellow-500",
  Platinum: "bg-purple-700"
};

const LoyaltyProgram = ({ 
  points = 350, 
  tier = "Silver", 
  nextTierPoints = 500, 
  pointsToNextTier = 150 
}: Partial<LoyaltyProgramProps>) => {
  const progress = ((points / nextTierPoints) * 100).toFixed(0);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">My Rewards</CardTitle>
          <div className={`px-3 py-1 text-white text-sm rounded-full font-medium ${tierColors[tier]}`}>
            {tier} Member
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">{points} Points</div>
          <div className="text-sm text-gray-500">{nextTierPoints} needed for {tier === "Platinum" ? "max tier" : "next tier"}</div>
        </div>
        
        <Progress value={Number(progress)} className="h-2 mb-6" />
        
        {tier !== "Platinum" && (
          <div className="text-center text-sm text-gray-600 mb-6">
            <TrendingUp className="inline mr-1 h-4 w-4" />
            Earn {pointsToNextTier} more points to reach {tier === "Bronze" ? "Silver" : tier === "Silver" ? "Gold" : "Platinum"}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="border rounded-lg p-3">
            <Gift className="w-6 h-6 mx-auto text-burgundy mb-1" />
            <div className="font-medium">Redeem</div>
            <div className="text-xs text-gray-500">Use your points</div>
          </div>
          <div className="border rounded-lg p-3">
            <Award className="w-6 h-6 mx-auto text-burgundy mb-1" />
            <div className="font-medium">Benefits</div>
            <div className="text-xs text-gray-500">See tier perks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
