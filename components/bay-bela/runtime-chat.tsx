"use client";

import { useState, useEffect, useRef } from "react";
import {
  getOrCreateSession,
  sendRuntimeMessage,
  getSessionMessages,
} from "@/app/actions/runtime";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "user",
    content: "Bu gece neden uyuyamıyorum Bay Bela?",
  },
  {
    role: "assistant",
    content: "Bazı geceler insanın kafası değil, şehir susmaz dostum.",
  },
  {
    role: "user",
    content: "Peki ne yapmalı?",
  },
  {
    role: "assistant",
    content:
      "Biraz yürümeli. Ama kendinden kaçmak için değil, kendine yetişmek için.",
  },
];

const LOCAL_SESSION_ID = "local-prototype-session";

const LOCAL_RESPONSES = [
  "Bazı geceler insan eve değil, eski haline dönmek ister dostum.",
  "Şehir bazen insanın içindeki boşluğu büyütür.",
  "Biraz müzik lazım sana. Ama eski bir şey.",
  "Her şey geçer, ama bazı şeyler geçerken iz bırakır.",
  "Gece yarısı soruların en dürüst olanlar.",
  "Bazen susmak, en iyi cevaptır.",
  "İzmir gecelerinde kaybolmak da bir yol.",
];

function getLocalResponse(): string {
  return LOCAL_RESPONSES[Math.floor(Math.random() * LOCAL_RESPONSES.length)];
}

export function RuntimeChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(LOCAL_SESSION_ID);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    // Try Supabase first, fallback to local
    if (isConnected && sessionId !== LOCAL_SESSION_ID) {
      try {
        const result = await sendRuntimeMessage(sessionId, userMessage, "bay-bela");
        if (result.success && result.assistantMessage) {
          setMessages((prev) => [...prev, result.assistantMessage!]);
          setIsLoading(false);
          return;
        }
      } catch {
        // Supabase failed, use local fallback
      }
    }

    // Local fallback response
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: getLocalResponse(),
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

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 flex flex-col h-[600px]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
            Runtime v1
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Prototype
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] ${isLoading ? "animate-pulse" : ""}`}
          />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {isLoading ? "Thinking..." : isConnected ? "Connected" : "Local Mode"}
          </span>
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
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-md border border-[hsl(var(--border))]"
              }`}
            >
              {message.role === "assistant" && (
                <span className="text-xs text-[hsl(var(--accent))] block mb-1 font-medium">
                  Bay Bela
                </span>
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
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesaj yaz..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all disabled:opacity-50"
            />
            {/* Glow effect when focused */}
            <div className="absolute inset-0 rounded-xl bg-[hsl(var(--accent))] opacity-0 blur-xl transition-opacity pointer-events-none peer-focus:opacity-10" />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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

        {/* Runtime indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Memory Active
          </span>
          <span className="text-[hsl(var(--border))]">|</span>
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Emotional State: Stable
          </span>
        </div>
      </div>
    </div>
  );
}
