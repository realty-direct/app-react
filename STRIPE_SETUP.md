# Stripe Payment Integration Setup

This document outlines the steps to set up Stripe payment integration for the RD Dashboard React application.

## Prerequisites

- Stripe account (create one at https://stripe.com)
- Supabase project with Edge Functions enabled

## Setup Steps

### 1. Configure Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to the API keys section
3. Copy your publishable key and secret key
4. Set up a webhook endpoint:
   - URL: `https://[YOUR-SUPABASE-PROJECT].supabase.co/functions/v1/verify-payment`
   - Events to listen for: `checkout.session.completed`
   - Copy the webhook signing secret

### 2. Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Frontend (Vite) variables
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

# Supabase Edge Function variables
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 3. Deploy Supabase Edge Functions

Deploy the functions to your Supabase project:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the functions
supabase functions deploy create-checkout-session
supabase functions deploy verify-payment
```

### 4. Set Edge Function Environment Variables

Set the environment variables for your edge functions:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 5. Database Schema Update

Ensure your database has the necessary columns for payment tracking. Run this SQL in the Supabase SQL editor:

```sql
-- Add payment-related columns to property_details table if they don't exist
ALTER TABLE property_details
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_date date,
ADD COLUMN IF NOT EXISTS stripe_payment_id text,
ADD COLUMN IF NOT EXISTS payment_amount decimal(10,2);

-- Create a payments table for tracking payment history
CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'aud',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
```

### 6. Testing

To test the integration:

1. Create a property listing in your application
2. Proceed to the payment step
3. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
4. After successful payment, verify:
   - User is redirected to the success page
   - Property status is updated to "active"
   - Payment record is created in the database

### 7. Production Deployment

When ready for production:

1. Switch to live Stripe API keys
2. Update webhook endpoint to use your production domain
3. Update all environment variables with production values
4. Test thoroughly with real payment methods

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Ensure the webhook secret is correctly set
   - Verify the webhook URL is accessible

2. **Payment succeeds but property not updated**
   - Check Supabase Edge Function logs
   - Verify database permissions
   - Ensure metadata is correctly passed

3. **Stripe checkout session creation fails**
   - Verify API keys are correct
   - Check for any validation errors in line items
   - Ensure all required fields are provided

### Support

For issues with:
- Stripe integration: Check [Stripe documentation](https://stripe.com/docs)
- Supabase Edge Functions: See [Supabase Edge Functions docs](https://supabase.com/docs/guides/functions)
- Application-specific issues: Check the application logs and database