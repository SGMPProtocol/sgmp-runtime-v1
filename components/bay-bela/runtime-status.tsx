export function RuntimeStatus() {
  const statusItems = [
    { label: "Memory", value: "active", color: "emerald" },
    { label: "Emotional state", value: "stable", color: "emerald" },
    { label: "Release candidate", value: "Alacati Yaz Sonu", color: "accent" },
    { label: "Runtime mode", value: "observer", color: "amber" },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500";
      case "amber":
        return "bg-amber-500";
      default:
        return "bg-[hsl(var(--accent))]";
    }
  };

  return (
    <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getColorClass(item.color)}`} />
              <span className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {item.label}:
              </span>
              <span className="text-sm text-[hsl(var(--foreground))]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
