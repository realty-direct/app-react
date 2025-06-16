import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update property details in database
      const { error } = await supabase
        .from("property_details")
        .update({
          payment_status: "completed",
          payment_date: new Date().toISOString().split("T")[0],
          listing_status: "active",
          stripe_payment_id: session.payment_intent,
          payment_amount: session.amount_total ? session.amount_total / 100 : 0,
        })
        .eq("id", session.metadata?.propertyId);

      if (error) {
        console.error("Error updating property details:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update property details" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Log the payment in a payments table (if you have one)
      await supabase.from("payments").insert({
        property_id: session.metadata?.propertyId,
        user_id: session.metadata?.userId,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        status: "completed",
        created_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Webhook error" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});