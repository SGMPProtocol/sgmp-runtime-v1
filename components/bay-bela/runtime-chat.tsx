"use client";

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
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(LOCAL_SESSION_ID);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(initializeRuntimeState);
  const [showMemoryPulse, setShowMemoryPulse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            console.log("[v0] LOADED_FROM_SUPABASE:", JSON.stringify(messagesResult.messages.map((m: { content: string }) => m.content)));
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

  const canSend = isReady && input.trim().length > 0 && !isLoading;

  async function handleSend() {
    if (!canSend) return;

    // ═══════════════════════════════════════════════════════════════════
    // CRITICAL: RAW USER INPUT PRESERVATION
    // The value captured here is SACRED and must NEVER be transformed
    // ═══════════════════════════════════════════════════════════════════
    
    // Step 1: Capture EXACT raw input from the text field
    const RAW_USER_INPUT: string = input;
    
    // Step 2: Create immutable copy for display (frozen to prevent mutation)
    const DISPLAYED_MESSAGE: string = String(RAW_USER_INPUT);
    
    // Step 3: Create separate copy ONLY for keyword analysis
    const NORMALIZED_INPUT: string = RAW_USER_INPUT.toLowerCase();
    
    // Debug logging - trace exact values through the flow
    console.log("[v0] ════════════════════════════════════════");
    console.log("[v0] RAW_USER_INPUT:", JSON.stringify(RAW_USER_INPUT));
    console.log("[v0] RAW_USER_INPUT length:", RAW_USER_INPUT.length);
    console.log("[v0] RAW_USER_INPUT charCodes:", Array.from(RAW_USER_INPUT).map(c => c.charCodeAt(0)));
    console.log("[v0] DISPLAYED_MESSAGE:", JSON.stringify(DISPLAYED_MESSAGE));
    console.log("[v0] NORMALIZED_INPUT (analysis only):", JSON.stringify(NORMALIZED_INPUT));
    console.log("[v0] ════════════════════════════════════════");
    
    // Clear input AFTER capturing
    setInput("");
    setIsLoading(true);

    // Generate response using runtime engine
    // NOTE: generateResponse receives the raw message for ANALYSIS ONLY
    // It returns a response but NEVER modifies or returns the user message
    const { response, newState, referencesMemory, emotionalTag } = generateResponse(
      RAW_USER_INPUT, // Pass raw for analysis, but we display DISPLAYED_MESSAGE
      runtimeState
    );

    // Update runtime state
    setRuntimeState(newState);

    // Create the user message object with DISPLAYED_MESSAGE (unmodified raw input)
    const userMessageObject: Message = { 
      role: "user", 
      content: DISPLAYED_MESSAGE // MUST be the exact raw input
    };
    
    // Integrity check: verify message was not mutated
    if (userMessageObject.content !== RAW_USER_INPUT) {
      console.error("[v0] CRITICAL: Message was mutated!");
      console.error("[v0] Original:", JSON.stringify(RAW_USER_INPUT));
      console.error("[v0] Mutated:", JSON.stringify(userMessageObject.content));
    }
    
    console.log("[v0] STORED_MESSAGE:", JSON.stringify(userMessageObject.content));

    // Add user message to state - this is what gets rendered
    setMessages((prev) => [...prev, userMessageObject]);

    // Calculate thinking delay based on emotional complexity
    const thinkingDelay = getThinkingDelay(newState.emotionalState);
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    // Show memory pulse if referencing past conversation
    if (referencesMemory) {
      setShowMemoryPulse(true);
      setTimeout(() => setShowMemoryPulse(false), 3000);
    }

    // Try Supabase logging with EXACT raw message, but don't block on failure
    if (isConnected && sessionId !== LOCAL_SESSION_ID) {
      try {
        console.log("[v0] SUPABASE_STORING:", JSON.stringify(DISPLAYED_MESSAGE));
        await sendRuntimeMessage(sessionId, DISPLAYED_MESSAGE, "bay-bela");
      } catch {
        // Supabase failed, continue with local response
      }
    }

    // Add assistant response
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
        emotionalTag,
        referencesMemory,
      },
    ]);

    setIsLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((message, index) => {
          // Log what is actually being rendered
          if (message.role === "user") {
            console.log("[v0] RENDERING_USER_MESSAGE:", JSON.stringify(message.content));
          }
          return (
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
          );
        })}

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
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isReady ? "Mesaj yaz..." : "Yükleniyor..."}
              disabled={!isReady || isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
              className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
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
