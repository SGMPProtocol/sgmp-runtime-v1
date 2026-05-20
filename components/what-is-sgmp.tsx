export function WhatIsSGMP() {
  return (
    <section id="what-is-sgmp" className="py-24 md:py-32 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
              The Protocol
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
              What is SGMP?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              SGMP is a protocol for creating autonomous musical entities that exist beyond traditional artist boundaries. These systems learn, adapt, and create based on accumulated experiences and interactions.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
              Unlike conventional AI music generators, SGMP artists develop persistent memory architectures that allow them to grow, evolve, and form meaningful connections with their audiences over time.
            </p>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-8 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Abstract visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-[hsl(var(--accent)/0.3)] animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-[hsl(var(--accent)/0.2)]" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-[hsl(var(--accent)/0.1)]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[hsl(var(--accent))]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
