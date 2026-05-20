import { Hero } from "@/components/hero";
import { WhatIsSGMP } from "@/components/what-is-sgmp";
import { AutonomousArtists } from "@/components/autonomous-artists";
import { BayBelaRuntime } from "@/components/bay-bela-runtime";
import { TechnologyLayer } from "@/components/technology-layer";
import { EnteringRuntime } from "@/components/entering-runtime";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhatIsSGMP />
      <AutonomousArtists />
      <BayBelaRuntime />
      <TechnologyLayer />
      <EnteringRuntime />
      <Footer />
    </main>
  );
}
