"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function submitWaitlist(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const message = formData.get("message") as string;

  if (!name || !email) {
    return { success: false, error: "Name and email are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("waitlist_contacts").insert([
      {
        name,
        email,
        role: role || null,
        message: message || null,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "This email is already on the waitlist" };
      }
      return { success: false, error: "Failed to join waitlist. Please try again." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
