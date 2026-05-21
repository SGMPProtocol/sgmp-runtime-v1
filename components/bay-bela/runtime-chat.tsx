"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SGMP RAW HUMAN SIGNAL RULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * User messages must be preserved EXACTLY as typed, including:
 * - lowercase / uppercase choices
 * - Turkish characters or missing Turkish characters  
 * - typos
 * - slang
 * - punctuation mistakes
 * - incomplete sentences
 * - emotional fragments
 * 
 * NEVER:
 * - correct grammar
 * - normalize display text
 * - rewrite user text
 * - autocapitalize
 * - add punctuation
 * - translate or transform
 * 
 * Architecture:
 * - raw_user_input: exact original text (display + database)
 * - analysis_text: internal lowercase copy ONLY for topic/emotion detection
 * 
 * Bay Bela may understand the meaning, but must NEVER rewrite the user's message.
 * Imperfect human writing is treated as emotional signal in SGMP.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef } from "react";
import {
  getOrCreateSession,
  sendRuntimeMessage,
  getSessionMessages,
} from "@/app/actions/runtime";
import {
  generateResponse,
  initializeRuntimeState,
  getEmotionalTagLabel,
  getThinkingDelay,
  CURRENT_RELEASE,
  type RuntimeState,
  type EmotionalTag,
} from "@/lib/runtime-engine";

interface Message {
  role: "user" | "assistant";
  content: string;
  emotionalTag?: EmotionalTag;
  referencesMemory?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "user",
    content: "Bu gece neden uyuyamıyorum Bay Bela?",
  },
  {
    role: "assistant",
    content: "Bazı geceler insanın kafası değil, şehir susmaz dostum.",
    emotionalTag: "reflective",
  },
  {
    role: "user",
    content: "Peki ne yapmalı?",
  },
  {
    role: "assistant",
    content:
      "Biraz yürümeli. Ama kendinden kaçmak için değil, kendine yetişmek için.",
    emotionalTag: "reflective",
  },
];

const LOCAL_SESSION_ID = "local-prototype-session";

export function RuntimeChat() {
  // ═══════════════════════════════════════════════════════════════════════════
  // ISOLATED DRAFT STATE - NOTHING ELSE MAY WRITE TO THIS
  // ═══════════════════════════════════════════════════════════════════════════
  const [draftMessage, setDraftMessage] = useState("");
  
  // Other state (completely separate from draft)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(LOCAL_SESSION_ID);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(initializeRuntimeState);
  const [showMemoryPulse, setShowMemoryPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Enable interaction immediately on mount
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    async function initSession() {
      try {
        const result = await getOrCreateSession("bay-bela");
        if (result.success && result.session) {
          setSessionId(result.session.id);
          setIsConnected(true);

          // Load existing messages if any
          const messagesResult = await getSessionMessages(result.session.id);
          if (
            messagesResult.success &&
            messagesResult.messages &&
            messagesResult.messages.length > 0
          ) {
            const loadedMessages = messagesResult.messages.map(
              (msg: { role: "user" | "assistant"; content: string }) => ({
                role: msg.role,
                content: msg.content,
              })
            );
            setMessages([...INITIAL_MESSAGES, ...loadedMessages]);
          }
        }
      } catch {
        // Session creation failed, continue with local-only mode
      }
    }

    initSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBMIT HANDLER - RAW HUMAN SIGNAL RULE ENFORCED
  // ═══════════════════════════════════════════════════════════════════════════
  async function handleSubmit() {
    // Step 1: Capture the EXACT raw user input (sacred - never modify)
    const raw_user_input = draftMessage;
    
    // Step 2: Validate - do nothing if empty
    if (!raw_user_input.trim()) return;
    if (isLoading) return;
    
    // Step 3: Clear draft IMMEDIATELY after capture (only place we clear it)
    setDraftMessage("");
    setIsLoading(true);

    // Step 4: Create analysis_text ONLY for emotion/topic detection
    // This is a separate copy - it NEVER affects display or storage
    const analysis_text = raw_user_input.toLowerCase();
    
    // Step 5: Generate Bay Bela response using analysis_text internally
    // The generateResponse function receives raw_user_input but uses
    // its own internal normalization for keyword detection
    const { response: bayBelaResponse, newState, referencesMemory, emotionalTag } = generateResponse(
      raw_user_input, // passed for analysis, but display/storage uses raw_user_input
      runtimeState
    );

    // Step 6: Update runtime state
    setRuntimeState(newState);

    // Step 7: Append raw_user_input to chat (EXACT text user typed - no modification)
    setMessages((prev) => [...prev, { role: "user", content: raw_user_input }]);

    // Step 8: Thinking delay
    const thinkingDelay = getThinkingDelay(newState.emotionalState);
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    // Step 9: Memory pulse effect
    if (referencesMemory) {
      setShowMemoryPulse(true);
      setTimeout(() => setShowMemoryPulse(false), 3000);
    }

    // Step 10: Save raw_user_input to Supabase (EXACT text - no modification)
    if (isConnected && sessionId !== LOCAL_SESSION_ID) {
      try {
        await sendRuntimeMessage(sessionId, raw_user_input, "bay-bela");
      } catch {
        // Supabase failed, continue
      }
    }

    // Step 11: Append Bay Bela response to chat
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: bayBelaResponse,
        emotionalTag,
        referencesMemory,
      },
    ]);

    setIsLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXTAREA CHANGE HANDLER - ONLY THING THAT WRITES TO DRAFT
  // ═══════════════════════════════════════════════════════════════════════════
  function handleDraftChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraftMessage(e.target.value);
  }

  const canSend = isReady && draftMessage.trim().length > 0 && !isLoading;
  const emotionalStateLabel = getEmotionalTagLabel(runtimeState.emotionalState);

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 flex flex-col h-[600px]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
            Runtime v2
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Emotional Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isReady ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-amber-500"} ${isLoading ? "animate-pulse" : ""}`}
          />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {!isReady ? "Initializing..." : isLoading ? "Thinking..." : isConnected ? "Connected" : "Local Mode"}
          </span>
        </div>
      </div>

      {/* Live Runtime Indicators */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] ${showMemoryPulse ? "memory-pulse" : ""}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.8)] glow-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-violet-400">Memory Active</span>
        </div>
        
        {runtimeState.isNightMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] uppercase tracking-wider text-blue-400">Night Mode</span>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
          <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px] ${
            runtimeState.emotionalState === "melancholy" ? "bg-indigo-400" :
            runtimeState.emotionalState === "playful" ? "bg-amber-400" :
            runtimeState.emotionalState === "nostalgic" ? "bg-purple-400" :
            runtimeState.emotionalState === "romantic" ? "bg-pink-400" :
            runtimeState.emotionalState === "drunk-philosophical" ? "bg-orange-400" :
            "bg-cyan-400"
          }`} />
          <span className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {emotionalStateLabel}
          </span>
        </div>

        {runtimeState.conversationTopics.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
              Topics: {runtimeState.conversationTopics.slice(-3).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Release Memory Card - Non-intrusive */}
      <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[hsl(var(--muted))] to-[hsl(var(--card))] border border-[hsl(var(--border))] border-l-2 border-l-amber-500/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] uppercase tracking-widest text-amber-400/80">Current Release Memory</span>
              <span className="w-1 h-1 rounded-full bg-amber-500/60 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{CURRENT_RELEASE.title}</p>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
              Status: <span className="text-amber-400/80">{CURRENT_RELEASE.status}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">Emotional field</p>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] italic leading-relaxed">
              {CURRENT_RELEASE.emotionalField.join(" / ")}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all ${
                message.role === "user"
                  ? "bg-[hsl(var(--accent))] text-white rounded-br-md shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                  : `bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-md border border-[hsl(var(--border))] ${message.referencesMemory ? "border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" : ""}`
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[hsl(var(--accent))] font-medium">
                    Bay Bela
                  </span>
                  {message.emotionalTag && (
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      message.emotionalTag === "melancholy" ? "bg-indigo-500/20 text-indigo-300" :
                      message.emotionalTag === "playful" ? "bg-amber-500/20 text-amber-300" :
                      message.emotionalTag === "nostalgic" ? "bg-purple-500/20 text-purple-300" :
                      message.emotionalTag === "romantic" ? "bg-pink-500/20 text-pink-300" :
                      message.emotionalTag === "drunk-philosophical" ? "bg-orange-500/20 text-orange-300" :
                      "bg-cyan-500/20 text-cyan-300"
                    }`}>
                      {message.emotionalTag}
                    </span>
                  )}
                  {message.referencesMemory && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                      memory
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-200">
            <div className="bg-[hsl(var(--muted))] rounded-2xl rounded-bl-md px-4 py-3 border border-[hsl(var(--border))]">
              <span className="text-xs text-[hsl(var(--accent))] block mb-1 font-medium">
                Bay Bela
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-6 pt-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-start gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={draftMessage}
              onChange={handleDraftChange}
              onKeyDown={handleKeyDown}
              placeholder={isReady ? "Mesaj yaz..." : "Yükleniyor..."}
              disabled={!isReady || isLoading}
              rows={1}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all disabled:opacity-50 resize-none"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSend}
            className="px-5 py-3 rounded-xl bg-[hsl(var(--accent))] text-white font-medium text-sm hover:bg-[hsl(220,70%,50%)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--card))] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        {/* Debug: Raw Draft Display (development only) */}
        {process.env.NODE_ENV === "development" && draftMessage && (
          <div className="mt-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-[10px] font-mono text-yellow-400 break-all">
            RAW DRAFT: {draftMessage}
          </div>
        )}

        {/* Runtime Status Footer */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          <span>Messages: {runtimeState.messageCount}</span>
          <span className="text-[hsl(var(--border))]">|</span>
          <span>{runtimeState.timeOfDay.replace("-", " ")}</span>
          <span className="text-[hsl(var(--border))]">|</span>
          <span>Bay Bela Runtime v2</span>
        </div>
      </div>
    </div>
  );
}
