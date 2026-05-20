export function Footer() {
  return (
    <footer className="py-12 border-t border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(220,80%,40%)] flex items-center justify-center">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="font-semibold text-[hsl(var(--foreground))]">SGMP</span>
          </div>
          
          <nav className="flex items-center gap-8">
            <a
              href="#what-is-sgmp"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Contact
            </a>
          </nav>
          
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Soul Groove Memory Protocol
          </p>
        </div>
      </div>
    </footer>
  );
}
