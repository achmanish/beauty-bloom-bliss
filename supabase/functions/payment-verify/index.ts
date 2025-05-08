
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KhaltiVerifyPayload {
  token: string;
  amount: number;
}

interface eSewaVerifyPayload {
  amt: number;
  rid: string;
  pid: string;
}

interface CodVerifyPayload {
  orderId: string;
  amount: number;
}

async function verifyKhaltiPayment(token: string, amount: number) {
  try {
    // Khalti API key would ideally be stored as a secret
    const khaltiApiKey = Deno.env.get("KHALTI_SECRET_KEY") || "test_secret_key_here";
    
    // For testing purposes, we're just returning success
    // In production, you would make a real API call to Khalti
    
    // const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Key ${khaltiApiKey}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     token,
    //     amount,
    //   }),
    // });
    
    // return await response.json();
    
    // Mock successful response for test environment
    return { success: true, amount: amount };
  } catch (error) {
    console.error("Khalti verification error:", error);
    throw error;
  }
}

async function verifyEsewaPayment(pid: string, amt: number, rid: string) {
  try {
    // For eSewa verification
    // In production, this would involve checking their verification API
    
    // Mock successful response for test environment
    return { success: true, amount: amt };
  } catch (error) {
    console.error("eSewa verification error:", error);
    throw error;
  }
}

async function verifyCashOnDeliveryOrder(orderId: string, amount: number) {
  try {
    // For Cash on Delivery, we just need to record the order
    // No actual payment verification needed
    
    return { success: true, message: "Cash on delivery order confirmed", amount: amount };
  } catch (error) {
    console.error("COD verification error:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    const body = await req.json();
    
    if (path === "khalti") {
      const { token, amount } = body as KhaltiVerifyPayload;
      const result = await verifyKhaltiPayment(token, amount);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (path === "esewa") {
      const { amt, rid, pid } = body as eSewaVerifyPayload;
      const result = await verifyEsewaPayment(pid, amt, rid);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (path === "cod") {
      const { orderId, amount } = body as CodVerifyPayload;
      const result = await verifyCashOnDeliveryOrder(orderId, amount);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in payment verification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
