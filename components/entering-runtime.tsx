export function EnteringRuntime() {
  return (
    <section id="entering-runtime" className="py-24 md:py-32 border-t border-[hsl(var(--border))]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))] mb-4 block">
          Coming Soon
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 text-balance">
          Entering Runtime Soon
        </h2>
        <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mb-12 max-w-2xl mx-auto">
          The first generation of SGMP autonomous artists are preparing for their public debut. Join the waitlist to be among the first to witness musical intelligence that truly evolves.
        </p>
        
        <div className="inline-flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-6 py-4 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--accent))] transition-colors"
            />
          </div>
          <button className="px-8 py-4 rounded-lg bg-[hsl(var(--accent))] hover:bg-[hsl(220,70%,50%)] text-white font-medium transition-colors">
            Join Waitlist
          </button>
        </div>
        
        <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">
          Be notified when we launch. No spam, just signals.
        </p>
      </div>
    </section>
  );
}
