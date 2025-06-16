import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../database/supabase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutSessionData {
  propertyId: string;
  packageType: string;
  packagePrice: number;
  enhancements: Array<{
    enhancement_type: string;
    price: number;
  }>;
  userId: string;
  promoCode?: string;
}

export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    // Create line items for Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: `${data.packageType} Package`,
            description: `Property listing package for ${data.propertyId}`,
          },
          unit_amount: data.packagePrice * 100, // Stripe expects cents
        },
        quantity: 1,
      },
      ...data.enhancements.map(enhancement => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: enhancement.enhancement_type.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
          },
          unit_amount: enhancement.price * 100,
        },
        quantity: 1,
      })),
    ];

    // Call your Supabase Edge Function to create the session
    const { data: session, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        lineItems,
        propertyId: data.propertyId,
        userId: data.userId,
        successUrl: `${window.location.origin}/property/${data.propertyId}/payment-success`,
        cancelUrl: `${window.location.origin}/property/${data.propertyId}/edit`,
        metadata: {
          propertyId: data.propertyId,
          packageType: data.packageType,
          userId: data.userId,
        },
      },
    });

    if (error) throw error;

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};