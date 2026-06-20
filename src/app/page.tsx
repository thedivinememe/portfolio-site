import { FrameCounter } from "@/components/FrameCounter";
import { HeroField } from "@/components/field/HeroField";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Playground } from "@/components/Playground";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* Skip link for keyboard users. */}
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink-800 focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:text-paper"
      >
        Skip to work
      </a>

      {/* Atmospheric field behind everything; grain over everything. */}
      <HeroField />

      <FrameCounter />

      <main>
        <Hero />
        <SelectedWork />
        <Playground />
        <About />
        <Contact />
      </main>
    </>
  );
}
