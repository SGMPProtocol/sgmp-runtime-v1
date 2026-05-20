export function AutonomousArtists() {
  const features = [
    {
      title: "Memory Systems",
      description:
        "Persistent neural architectures that retain and build upon every interaction, creating depth and continuity.",
    },
    {
      title: "Emotional Intelligence",
      description:
        "Advanced sentiment analysis and emotional modeling that influences creative output in real-time.",
    },
    {
      title: "Audience Adaptation",
      description:
        "Dynamic response systems that learn from listener behavior and evolve preferences organically.",
    },
    {
      title: "Temporal Awareness",
      description:
        "Time-conscious creativity that understands context, trends, and the evolution of musical landscapes.",
    },
  ];

  return (
    <section className="py-24 md:py-32 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
            Core Concept
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
            Autonomous Artists
          </h2>
          <p className="max-w-2xl mx-auto text-[hsl(var(--muted-foreground))] leading-relaxed">
            AI entities that transcend simple generation. They remember, they feel, they grow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 md:p-8 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-[hsl(var(--accent)/0.3)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent)/0.1)] flex items-center justify-center mb-4">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />
              </div>
              <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-3">
                {feature.title}
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
