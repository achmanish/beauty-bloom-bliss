
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

async function verifyKhaltiPayment(token: string, amount: number) {
  try {
    // Khalti API key would ideally be stored as a secret
    const khaltiApiKey = Deno.env.get("KHALTI_SECRET_KEY") || "test_secret_key_here";
    
    const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
      method: "POST",
      headers: {
        "Authorization": `Key ${khaltiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        amount,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Khalti verification error:", error);
    throw error;
  }
}

async function verifyEsewaPayment(pid: string, amt: number, rid: string) {
  try {
    // For eSewa verification
    // Typically this would involve checking their verification API
    // This is a simplified example
    const response = await fetch("https://uat.esewa.com.np/epay/transrec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amt: amt.toString(),
        rid,
        pid,
        scd: Deno.env.get("ESEWA_MERCHANT_ID") || "EPAYTEST",
      }).toString(),
    });
    
    const text = await response.text();
    // eSewa returns a success message in the HTML response
    const success = text.includes("Success");
    
    return { success };
  } catch (error) {
    console.error("eSewa verification error:", error);
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
