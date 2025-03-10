import { supabase } from "./supabase";

// ✅ Sign Up User
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
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  });

  if (error) return { user: null, error };

  // ✅ If user exists, insert profile into `profiles` table
  if (data?.user) {
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    ]);

    if (profileError) return { user: null, error: profileError };
  }

  return { user: data?.user, error: null };
};

// ✅ Sign In User
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return {
        user: null,
        error: { message: "Please confirm your email before signing in." },
      };
    }
    return { user: null, error };
  }

  return { data, error: null };
};

// ✅ Sign Out User
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("❌ Logout error:", error.message);
};

// ✅ Resend Confirmation Email
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

// export const fetchUserProfile = async (userId: string) => {
//     const { data: profile, error: profileError } = await supabase
//     .from("profiles")
//     .select("first_name, last_name")
//     .eq("id", user.id)
//     .single();
// }

export const fetchUserProfile = async (userId: string) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", userId)
    .single();

  return { profile, profileError };
};
