
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Khalti verification error:", error);
      throw error;
    }
  }

  static async verifyEsewaPayment(pid: string, amt: number, rid: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('payment-verify/esewa', {
        method: 'POST',
        body: { pid, amt, rid },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("eSewa verification error:", error);
      throw error;
    }
  }

  static async createPaymentRecord(paymentDetails: PaymentDetails): Promise<any> {
    try {
      const { orderId, amount, paymentMethod, paymentData } = paymentDetails;

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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating payment record:", error);
      throw error;
    }
  }
}
