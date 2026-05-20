export function RuntimeChat() {
  const messages = [
    {
      type: "user" as const,
      text: "Bu gece neden uyuyamiyorum Bay Bela?",
    },
    {
      type: "assistant" as const,
      text: "Bazi geceler insanin kafasi degil, sehir susmaz dostum.",
    },
    {
      type: "user" as const,
      text: "Peki ne yapmali?",
    },
    {
      type: "assistant" as const,
      text: "Biraz yurumeli. Ama kendinden kacmak icin degil, kendine yetismek icin.",
    },
  ];

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
          Runtime Preview
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.type === "user"
                  ? "bg-[hsl(var(--accent))] text-white rounded-br-md"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-md"
              }`}
            >
              {message.type === "assistant" && (
                <span className="text-xs text-[hsl(var(--accent))] block mb-1 font-medium">
                  Bay Bela
                </span>
              )}
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input preview */}
      <div className="mt-6 pt-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
          <span className="text-sm">Mesaj yazin...</span>
          <div className="ml-auto w-2 h-4 bg-[hsl(var(--muted-foreground)/0.5)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
