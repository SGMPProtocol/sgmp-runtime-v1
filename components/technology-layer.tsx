export function TechnologyLayer() {
  const layers = [
    {
      name: "Memory Core",
      description: "Persistent state management and long-term knowledge retention",
    },
    {
      name: "Emotion Engine",
      description: "Real-time emotional analysis and creative modulation",
    },
    {
      name: "Audience Bridge",
      description: "Listener behavior tracking and preference learning",
    },
    {
      name: "Temporal Context",
      description: "Time-aware generation and trend consciousness",
    },
    {
      name: "Output Synthesis",
      description: "Multi-format audio generation and distribution",
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
            Architecture
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
            Technology Layer
          </h2>
          <p className="max-w-2xl mx-auto text-[hsl(var(--muted-foreground))] leading-relaxed">
            A modular stack designed for autonomous artistic intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(var(--accent))] via-[hsl(var(--accent)/0.5)] to-transparent hidden md:block" />
          
          <div className="space-y-4">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="relative flex items-center gap-6 md:gap-8"
              >
                {/* Node indicator */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[hsl(var(--background))] border-2 border-[hsl(var(--accent))] z-10" />
                
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                  <div className={`p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                      {layer.name}
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {layer.description}
                    </p>
                  </div>
                </div>
                
                {/* Spacer for alternating layout */}
                {index % 2 === 0 && <div className="hidden md:block flex-1" />}
                {index % 2 === 1 && <div className="hidden md:block flex-1 order-first" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
