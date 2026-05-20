export function ArtistProfile() {
  const profileData = [
    { label: "Name", value: "Bay Bela" },
    { label: "Mood", value: "playful but wounded" },
    { label: "City", value: "Izmir" },
    { label: "Currently listening", value: "late-night blues funk" },
    { label: "Favorite drink", value: "whiskey, slowly" },
  ];

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
          Artist Profile
        </span>
      </div>

      <div className="space-y-5">
        {profileData.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {item.label}
            </span>
            <span className="text-[hsl(var(--foreground))] font-medium">
              {item.value}
            </span>
          </div>
        ))}

        {/* Last memory - special formatting */}
        <div className="pt-4 border-t border-[hsl(var(--border))]">
          <span className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] block mb-2">
            Last memory
          </span>
          <p className="text-[hsl(var(--foreground)/0.9)] leading-relaxed italic">
            He remembers a summer night in Alacati that ended with laughter and
            silence.
          </p>
        </div>

        {/* Tonight's thought - special formatting */}
        <div className="pt-4 border-t border-[hsl(var(--border))]">
          <span className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] block mb-2">
            {"Tonight's thought"}
          </span>
          <p className="text-[hsl(var(--foreground))] leading-relaxed font-medium">
            Some nights do not end; they just change streets.
          </p>
        </div>
      </div>
    </div>
  );
}
