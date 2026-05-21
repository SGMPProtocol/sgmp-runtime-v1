"use server";

import { supabase } from "@/lib/supabase";

// ═══════════════════════════════════════════════════════════════════════════════
// SGMP SESSION PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════
// Sessions persist across page refreshes using localStorage session_id.
// Messages are stored in Supabase with exact raw user input (never modified).
// Bay Bela should feel like a continuous conversation, not a reset chatbot.

export async function getOrCreateSession(artistId: string = "bay-bela", existingSessionId?: string) {
  try {
    // If client provides an existing session ID, try to use it
    if (existingSessionId) {
      const { data: existingSession, error: fetchError } = await supabase
        .from("runtime_sessions")
        .select("*")
        .eq("id", existingSessionId)
        .eq("artist_id", artistId)
        .single();

      if (!fetchError && existingSession) {
        return { success: true, session: existingSession };
      }
      // If session not found, fall through to create new one
    }

    // Create new session
    const { data: newSession, error: createError } = await supabase
      .from("runtime_sessions")
      .insert([
        {
          artist_id: artistId,
          status: "active",
          context: {
            mood: "reflective",
            location: "İzmir",
            time_of_day: "late-night",
          },
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("[v0] Error creating session:", createError);
      return { success: false, error: createError.message };
    }

    return { success: true, session: newSession, isNew: true };
  } catch (error) {
    console.error("[v0] Session error:", error);
    return { success: false, error: "Failed to get or create session" };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RAW INPUT INTEGRITY - Messages stored exactly as user typed them
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendRuntimeMessage(
  sessionId: string,
  userMessage: string,
  artistId: string = "bay-bela"
) {
  try {
    // Save user message - EXACT raw input, no modification
    const { error: userMsgError } = await supabase
      .from("runtime_messages")
      .insert([
        {
          session_id: sessionId,
          artist_id: artistId,
          role: "user",
          content: userMessage, // RAW - never modify
        },
      ]);

    if (userMsgError) {
      console.error("[v0] Error saving user message:", userMsgError);
      return { success: false, error: userMsgError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Runtime message error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

// Save Bay Bela's response separately
export async function saveAssistantMessage(
  sessionId: string,
  response: string,
  emotionalTag: string,
  artistId: string = "bay-bela"
) {
  try {
    const { error } = await supabase
      .from("runtime_messages")
      .insert([
        {
          session_id: sessionId,
          artist_id: artistId,
          role: "assistant",
          content: response,
          metadata: { emotionalTag },
        },
      ]);

    if (error) {
      console.error("[v0] Error saving assistant message:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Save assistant message error:", error);
    return { success: false, error: "Failed to save response" };
  }
}

export async function getSessionMessages(sessionId: string) {
  try {
    const { data: messages, error } = await supabase
      .from("runtime_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[v0] Error fetching messages:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messages: messages || [] };
  } catch (error) {
    console.error("[v0] Fetch messages error:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

// End current session (for "Yeni gece başlat")
export async function endSession(sessionId: string) {
  try {
    const { error } = await supabase
      .from("runtime_sessions")
      .update({ status: "ended" })
      .eq("id", sessionId);

    if (error) {
      console.error("[v0] Error ending session:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] End session error:", error);
    return { success: false, error: "Failed to end session" };
  }
}
