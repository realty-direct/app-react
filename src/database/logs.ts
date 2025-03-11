import { supabase } from "../database/supabase";

export const logErrorToDB = async (error: Error, userId?: string) => {
  await supabase.from("logs").insert({
    user_id: userId ?? null,
    error_message: error.message,
    stack_trace: error.stack ?? null,
  });
};
