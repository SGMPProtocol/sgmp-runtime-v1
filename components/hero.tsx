export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-hsl(var(--accent)/0.05) via-transparent to-transparent" />
      
      {/* Animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(220,70%,55%,0.03)] blur-[120px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo mark */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(220,80%,40%)] flex items-center justify-center">
            <span className="text-2xl font-bold text-white tracking-tight">S</span>
          </div>
        </div>
        
        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[hsl(var(--foreground))] mb-4">
          <span className="text-balance">SGMP</span>
        </h1>
        
        {/* Protocol name */}
        <p className="text-lg md:text-xl lg:text-2xl text-[hsl(var(--muted-foreground))] tracking-widest uppercase mb-4">
          Soul Groove Memory Protocol
        </p>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-[hsl(var(--foreground)/0.9)] mb-8">
          <span className="text-balance">Autonomous Music Intelligence Platform</span>
        </p>
        
        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-[hsl(var(--muted-foreground))] leading-relaxed mb-12">
          <span className="text-pretty">
            AI-native artist systems that evolve through memory, emotion, audience behavior and time.
          </span>
        </p>
        
        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#entering-runtime"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-[hsl(var(--accent))] hover:bg-[hsl(220,70%,50%)] rounded-lg transition-colors"
          >
            Explore the Protocol
          </a>
          <a
            href="#what-is-sgmp"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[hsl(var(--muted-foreground))]">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[hsl(var(--muted-foreground))] to-transparent" />
      </div>
    </section>
  );
}
