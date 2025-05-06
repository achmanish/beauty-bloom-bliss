
import { supabase } from "@/integrations/supabase/client";

export interface PaymentDetails {
  orderId: string;
  amount: number;
  paymentMethod: 'esewa' | 'khalti';
  paymentData: any;
}

export class PaymentService {
  static async verifyKhaltiPayment(token: string, amount: number): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('payment-verify/khalti', {
        method: 'POST',
        body: { token, amount },
      });

      if (error) {
        console.error("Khalti verification error:", error);
        throw new Error(`Payment verification failed: ${error.message}`);
      }
      
      return data;
    } catch (error: any) {
      console.error("Khalti verification error:", error);
      throw new Error(error.message || "Payment verification failed");
    }
  }

  static async verifyEsewaPayment(pid: string, amt: number, rid: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('payment-verify/esewa', {
        method: 'POST',
        body: { pid, amt, rid },
      });

      if (error) {
        console.error("eSewa verification error:", error);
        throw new Error(`Payment verification failed: ${error.message}`);
      }
      
      return data;
    } catch (error: any) {
      console.error("eSewa verification error:", error);
      throw new Error(error.message || "Payment verification failed");
    }
  }

  static async createPaymentRecord(paymentDetails: PaymentDetails): Promise<any> {
    try {
      const { orderId, amount, paymentMethod, paymentData } = paymentDetails;
      
      if (!orderId || !amount || !paymentMethod || !paymentData) {
        throw new Error("Missing payment details");
      }

      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount,
          payment_method: paymentMethod,
          status: 'successful',
          transaction_id: paymentMethod === 'khalti' ? paymentData.idx : paymentData.rid,
        })
        .select();

      if (error) {
        console.error("Error creating payment record:", error);
        throw new Error(`Failed to create payment record: ${error.message}`);
      }
      
      return data;
    } catch (error: any) {
      console.error("Error creating payment record:", error);
      throw new Error(error.message || "Failed to create payment record");
    }
  }
}
