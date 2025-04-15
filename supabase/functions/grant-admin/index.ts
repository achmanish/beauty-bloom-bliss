
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key (needed for admin operations)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Create a Supabase client with the auth token (to verify the requesting user)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the JWT from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid token");
    }

    // Get request body
    const { targetUserId } = await req.json();
    
    if (!targetUserId) {
      throw new Error("Target user ID is required");
    }

    // Check if the requesting user is already an admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
      
    if (adminError || !adminData) {
      throw new Error("You do not have admin privileges");
    }

    // Grant admin privileges to the target user
    const { data, error } = await supabaseAdmin
      .from("admins")
      .insert({ id: targetUserId })
      .select()
      .single();
      
    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Admin privileges granted", data }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 400 
      }
    );
  }
});
