import { createClient } from "@supabase/supabase-js";

// ✅ Move these to .env in production
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // ✅ Ensure session persistence
    autoRefreshToken: true, // ✅ Automatically refresh tokens when needed
    detectSessionInUrl: false, // ✅ Prevent URL-based session handling
  },
});

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

  return { user: data?.user, error: null };
};

// ✅ Sign Out User
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("❌ Logout error:", error.message);
};

// ✅ Check User Session (Returns `user` object or `null`)
export const checkUserSession = async () => {
  const { data, error } = await supabase.auth.getUser();
  console.log("User session data:", data);
  if (error) {
    console.error("❌ Error fetching user session:", error.message);
    return null;
  }
  return data.user || null;
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

export const uploadPropertyImage = async (propertyId: string, file: File) => {
  const filePath = `${propertyId}/${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;

  // ✅ Use the exact bucket name
  const { data, error } = await supabase.storage
    .from("property_photographs") // 🔥 Ensure this matches exactly
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("❌ Image upload failed:", error);
    return null;
  }

  return supabase.storage.from("property_photographs").getPublicUrl(filePath)
    .data.publicUrl;
};

export const deletePropertyImage = async (
  imageUrl: string
): Promise<boolean> => {
  try {
    const filePath = imageUrl.split(
      "/storage/v1/object/public/property_photographs/"
    )[1];
    if (!filePath) {
      console.error("❌ Invalid file path:", imageUrl);
      return false;
    }

    const { error } = await supabase.storage
      .from("property_photographs")
      .remove([filePath]);
    if (error) {
      console.error("❌ Error deleting image from storage:", error);
      return false;
    }

    console.log("✅ Image deleted successfully:", imageUrl);
    return true;
  } catch (error) {
    console.error("❌ deletePropertyImage error:", error);
    return false;
  }
};
