import { supabase } from "./supabase";

// ✅ Check User Session (Returns `user` object or `null`)
export const checkUserSession = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("❌ Error fetching user session:", error.message);
    return null;
  }
  return data.user || null;
};

// ✅ Sign Up User with phone number (using Supabase Phone Auth)
export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) => {
  try {
    // Step 1: Create user account with email password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        },
      },
    });

    if (error) return { user: null, error };

    // Step 2: Insert profile data into our profiles table
    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          phone_confirmed: false, // Initially false, will be verified
        },
      ]);

      if (profileError) {
        console.error("❌ Error creating profile:", profileError);
        // We'll continue anyway since the auth account was created
      }
    }

    return { user: data?.user, error: null };
  } catch (error: any) {
    console.error("❌ Error during signup:", error);
    return {
      user: null,
      error: { message: error.message || "An error occurred during signup" },
    };
  }
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

// ✅ Fetch user profile
export const fetchUserProfile = async (userId: string) => {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { profile, profileError };
};

// ✅ Verify phone with OTP
export const startPhoneVerification = async (phoneNumber: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error starting phone verification:", error);
    return {
      success: false,
      error: error.message || "Failed to start phone verification",
    };
  }
};

// ✅ Verify phone OTP code
export const verifyPhoneOtp = async (
  phoneNumber: string,
  otp: string,
  userId: string
) => {
  try {
    // Verify the OTP
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    });

    if (error) {
      throw error;
    }

    // If verification successful, update our profile record
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ phone_confirmed: true })
      .eq("id", userId);

    if (updateError) {
      console.error(
        "❌ Error updating phone verification status:",
        updateError
      );
      // We'll consider it verified anyway since Supabase verified it
    }

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error verifying phone OTP:", error);
    return {
      success: false,
      error: error.message || "Failed to verify phone number",
    };
  }
};

// ✅ Update phone number directly (for account page)
export const updatePhoneNumber = async (
  userId: string,
  phoneNumber: string
) => {
  try {
    // First update in the profiles table
    const { error } = await supabase
      .from("profiles")
      .update({
        phone_number: phoneNumber,
        phone_confirmed: false, // Reset verification status
      })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Phone number updated. It will need to be verified.",
    };
  } catch (error: any) {
    console.error("❌ Error updating phone number:", error);
    return {
      success: false,
      error: error.message || "Failed to update phone number",
    };
  }
};
