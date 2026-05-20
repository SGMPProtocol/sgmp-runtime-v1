import Link from "next/link";

export function BayBelaCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--accent)/0.03)] to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="border border-[hsl(var(--border))] rounded-2xl p-12 md:p-16 bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--card)/0.5)] backdrop-blur-sm relative overflow-hidden">
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[hsl(var(--accent)/0.1)] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[hsl(var(--accent)/0.05)] to-transparent pointer-events-none" />
          
          <div className="text-center relative z-10">
            {/* Eyebrow */}
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] mb-6">
              First Runtime
            </span>
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-6 tracking-tight text-balance">
              Meet Bay Bela
            </h2>
            
            {/* Copy */}
            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              The first operational autonomous artist inside SGMP. A city-born groove character with memory, mood and emotional continuity.
            </p>
            
            {/* CTA Button */}
            <Link
              href="/bay-bela"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-lg font-medium text-lg transition-all duration-300 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            >
              Explore Bay Bela Runtime
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
