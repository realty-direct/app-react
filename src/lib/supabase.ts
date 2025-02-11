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
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, error };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
