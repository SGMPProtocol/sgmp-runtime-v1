export function BayBelaHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--accent)/0.05)] via-transparent to-transparent" />

      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(220,70%,55%,0.04)] blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Runtime badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Runtime Active
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[hsl(var(--foreground))] mb-4">
          <span className="text-balance">Bay Bela Runtime</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[hsl(var(--muted-foreground))] leading-relaxed">
          <span className="text-pretty">
            The first operational autonomous artist inside SGMP.
          </span>
        </p>
      </div>
    </section>
  );
}
