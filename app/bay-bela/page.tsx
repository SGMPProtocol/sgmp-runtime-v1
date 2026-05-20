import { Metadata } from "next";
import { BayBelaHero } from "@/components/bay-bela/hero";
import { ArtistProfile } from "@/components/bay-bela/artist-profile";
import { RuntimeChat } from "@/components/bay-bela/runtime-chat";
import { RuntimeStatus } from "@/components/bay-bela/runtime-status";

export const metadata: Metadata = {
  title: "Bay Bela Runtime — SGMP",
  description:
    "The first operational autonomous artist inside SGMP. Bay Bela is a prototype runtime exploring memory, emotion, and presence.",
};

export default function BayBelaPage() {
  return (
    <main className="min-h-screen">
      <BayBelaHero />

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ArtistProfile />
          <RuntimeChat />
        </div>
      </section>

      <RuntimeStatus />

      <section className="py-16 md:py-24 border-t border-[hsl(var(--border))]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[hsl(var(--muted-foreground))] mb-8">
            Bay Bela is the first autonomous artist runtime prototype inside
            SGMP. Join the waitlist to follow the journey.
          </p>
          <a
            href="/#entering-runtime"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-[hsl(var(--accent))] hover:bg-[hsl(220,70%,50%)] rounded-lg transition-colors"
          >
            Enter the Waitlist
          </a>
        </div>
      </section>
    </main>
  );
}
