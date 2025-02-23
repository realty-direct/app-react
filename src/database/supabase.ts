import { createClient } from "@supabase/supabase-js";

// TODO: If I ever open source this project, move these to .env

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define types for the database schema
export interface Property {
  id: string;
  name: string; // ✅ Ensure consistency with `store/types.ts`
  title: string;
  price: number;
  description: string;
  created_at: string;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Authentication Functions
// TODO: Add phone number auth
export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`, // ✅ Redirect to confirmation page
    },
  });

  if (error) return { user: null, error };

  // ✅ Save user profile data in the "profiles" table (if confirmation is required, this happens after email verification)
  if (data?.user) {
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id, // ✅ Link profile to Supabase Auth user ID
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    ]);

    if (profileError) return { user: null, error: profileError };
  }

  return { user: data?.user, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.message.includes("Email not confirmed")) {
    return {
      user: null,
      error: { message: "Please confirm your email before signing in." },
    };
  }

  return { user: data?.user, error };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const checkUserSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user || null;
};

export const resendConfirmationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  });

  return { error };
};
