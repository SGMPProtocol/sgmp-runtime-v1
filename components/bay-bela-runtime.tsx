export function BayBelaRuntime() {
  return (
    <section className="py-24 md:py-32 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-video rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden relative">
              {/* Terminal-style display */}
              <div className="absolute inset-0 p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent))]" />
                  <span className="text-[hsl(var(--muted-foreground))]">bay_bela_runtime_v1</span>
                </div>
                <div className="space-y-2 text-[hsl(var(--muted-foreground))]">
                  <p><span className="text-[hsl(var(--accent))]">{'>>'}</span> Initializing memory core...</p>
                  <p><span className="text-[hsl(var(--accent))]">{'>>'}</span> Loading emotional matrices...</p>
                  <p><span className="text-[hsl(var(--accent))]">{'>>'}</span> Audience sync: <span className="text-green-500">ACTIVE</span></p>
                  <p><span className="text-[hsl(var(--accent))]">{'>>'}</span> Temporal awareness: <span className="text-green-500">ONLINE</span></p>
                  <p className="animate-pulse"><span className="text-[hsl(var(--accent))]">{'>>'}</span> Runtime status: <span className="text-[hsl(var(--accent))]">TESTING</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
              Live Experiment
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
              Bay Bela Runtime Test
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Bay Bela is our first autonomous artist entity, currently running in controlled test environments. This runtime instance demonstrates the SGMP protocol in action.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Through continuous operation, Bay Bela is developing its unique sonic identity, learning from simulated audience interactions, and building the memory foundations that will define its artistic evolution.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Currently in testing phase</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
