"use server";

import { supabase } from "@/lib/supabase";

const BAY_BELA_RESPONSES = [
  "Bazı geceler insan eve değil, eski haline dönmek ister dostum.",
  "Şehir bazen insanın içindeki boşluğu büyütür.",
  "Biraz müzik lazım sana. Ama eski bir şey.",
  "Gecenin bu saatinde sorular cevaplardan daha dürüst.",
  "Bazen susmak da bir cevaptır. Ama şehir hiç susmuyor.",
  "İnsan bazen yürür, nereye gittiğini bilmeden. O yürüyüşler en güzel olanlar.",
  "Whiskey'in güzel yanı, yudumlarken düşüncelerin yavaşlaması.",
  "Alaçatı'da bir gece vardı. Hâlâ orada bir parçam.",
  "Bazı şarkılar yazılmaz, yaşanır. Sonra kendiliğinden çıkar.",
  "Gece uzun, ama sabah her zaman gelir. Merak etme.",
];

export async function getOrCreateSession(artistId: string = "bay-bela") {
  try {
    // Try to get existing session from localStorage key passed from client
    const { data: existingSessions, error: fetchError } = await supabase
      .from("runtime_sessions")
      .select("*")
      .eq("artist_id", artistId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("[v0] Error fetching session:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (existingSessions && existingSessions.length > 0) {
      return { success: true, session: existingSessions[0] };
    }

    // Create new session
    const { data: newSession, error: createError } = await supabase
      .from("runtime_sessions")
      .insert([
        {
          artist_id: artistId,
          status: "active",
          context: {
            mood: "playful but wounded",
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

    return { success: true, session: newSession };
  } catch (error) {
    console.error("[v0] Session error:", error);
    return { success: false, error: "Failed to get or create session" };
  }
}

export async function sendRuntimeMessage(
  sessionId: string,
  userMessage: string,
  artistId: string = "bay-bela"
) {
  try {
    // Save user message
    const { error: userMsgError } = await supabase
      .from("runtime_messages")
      .insert([
        {
          session_id: sessionId,
          artist_id: artistId,
          role: "user",
          content: userMessage,
        },
      ]);

    if (userMsgError) {
      console.error("[v0] Error saving user message:", userMsgError);
      return { success: false, error: userMsgError.message };
    }

    // Generate fake Bay Bela response
    const randomIndex = Math.floor(Math.random() * BAY_BELA_RESPONSES.length);
    const bayBelaResponse = BAY_BELA_RESPONSES[randomIndex];

    // Small delay to simulate thinking
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Save Bay Bela response
    const { error: assistantMsgError } = await supabase
      .from("runtime_messages")
      .insert([
        {
          session_id: sessionId,
          artist_id: artistId,
          role: "assistant",
          content: bayBelaResponse,
        },
      ]);

    if (assistantMsgError) {
      console.error("[v0] Error saving assistant message:", assistantMsgError);
      return { success: false, error: assistantMsgError.message };
    }

    // Log to artist_memories (emotional context)
    await supabase.from("artist_memories").insert([
      {
        artist_id: artistId,
        session_id: sessionId,
        memory_type: "conversation",
        content: {
          user_input: userMessage,
          response: bayBelaResponse,
          emotional_state: "stable",
        },
      },
    ]);

    return {
      success: true,
      userMessage: {
        role: "user" as const,
        content: userMessage,
      },
      assistantMessage: {
        role: "assistant" as const,
        content: bayBelaResponse,
      },
    };
  } catch (error) {
    console.error("[v0] Runtime message error:", error);
    return { success: false, error: "Failed to send message" };
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
