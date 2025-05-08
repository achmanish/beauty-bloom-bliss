
/**
 * Format a number as Nepalese Rupees
 * @param amount Number to format
 * @returns String representing the amount in Nepalese Rupees format
 */
export const formatNepaliCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('ne-NP')}`;
};

/**
 * Convert price from other currency to NPR
 * @param price Price in another currency
 * @param exchangeRate Exchange rate to NPR
 * @returns Price in NPR
 */
export const convertToNPR = (price: number, exchangeRate: number = 1): number => {
  return Math.round(price * exchangeRate);
};

/**
 * Get delivery charge estimate based on distance and weight
 * @param distance Distance in km
 * @param weight Weight in kg
 * @returns Delivery charge in NPR
 */
export const calculateDeliveryCharge = (
  distance: number, 
  weight: number = 1,
  isOutsideKathmandu: boolean = false
): number => {
  // Base rate
  let baseRate = 100;
  
  // Add distance factor (NPR 10 per km after first 5km)
  const distanceFee = distance > 5 ? (distance - 5) * 10 : 0;
  
  // Add weight factor (NPR 20 per kg after first kg)
  const weightFee = weight > 1 ? (weight - 1) * 20 : 0;
  
  // Outside Kathmandu Valley fee
  const locationFee = isOutsideKathmandu ? 200 : 0;
  
  return Math.round(baseRate + distanceFee + weightFee + locationFee);
};
