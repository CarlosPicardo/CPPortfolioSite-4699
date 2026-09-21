import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { useField } from "../lib/i18n";
import { Logo3D, Pillars3D } from "./epr-3d";

// EPR Standard brand palette (from eprstandard.com)
const EPR = {
  espresso: "#0d0a08",
  espresso2: "#1a1310",
  panel: "#221a14",
  cream: "#f2ede4",
  creamMuted: "#a89880",
  copper: "#9a6b43",
  copperLight: "#c4986a",
};

interface EprContent {
  eyebrow?: string;
  title?: string;
  body?: string;
  tagline?: string;
  link?: string;
}

const fallback: EprContent = {
  eyebrow: "Founder & CEO",
  title: "EPR Standard",
  body: "EPR Standard — short for Engineering & Producing Rights — is a framework for recognising the people who shape the sound of recorded music. Not just who wrote the song, but who engineered, produced and crafted the final record.",
  tagline: "Authors of Sound",
  link: "https://eprstandard.com",
};

export function EprStandard() {
  const { data = fallback } = useContent<EprContent>("epr", fallback);
  const c = { ...fallback, ...data };
  const f = useField(c as unknown as Record<string, unknown>);

  return (
    <section
      id="epr"
      className="relative overflow-hidden"
      style={{ backgroundColor: EPR.espresso, color: EPR.cream }}
    >
      {/* top + bottom fade into the dark portfolio */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, #0A0A0A, transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to top, #0A0A0A, transparent)" }}
      />

      {/* ===== CINEMATIC HERO BAND ===== */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-32">
        {/* warm radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] max-w-[140vw] rounded-full blur-[180px] pointer-events-none"
          style={{ backgroundColor: "rgba(154,107,67,0.16)" }}
        />
        {/* faint grain / vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs md:text-sm uppercase tracking-[0.5em] mb-8"
              style={{ color: EPR.copperLight, fontFamily: "'Space Mono', monospace" }}
            >
              {c.eyebrow}
            </p>
          </AnimatedSection>

          {/* Classic full lockup — animated 3D */}
          <Logo3D />

          {/* Slogan */}
          <AnimatedSection delay={0.22}>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.02] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-display)", color: EPR.cream }}
            >
              Authors of{" "}
              <span style={{ color: EPR.copperLight }}>Sound.</span>
            </h2>
          </AnimatedSection>

          {/* What EPR stands for */}
          <AnimatedSection delay={0.32}>
            <p
              className="text-sm md:text-base uppercase tracking-[0.3em] mb-8"
              style={{ color: EPR.copperLight, fontFamily: "'Space Mono', monospace" }}
            >
              Engineering &amp; Producing Rights
            </p>
          </AnimatedSection>

          {/* What it is */}
          <AnimatedSection delay={0.4}>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)", color: EPR.creamMuted }}
            >
              {f("body")}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 rounded-sm"
              style={{
                backgroundColor: EPR.copper,
                color: EPR.espresso,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Visit EPR Standard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </AnimatedSection>
        </div>
      </div>

      {/* ===== 3D PILLARS ===== */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-28 md:pb-32">
        <AnimatedSection>
          <p
            className="text-center text-xs uppercase tracking-[0.4em] mb-10"
            style={{ color: EPR.copperLight, fontFamily: "'Space Mono', monospace" }}
          >
            What it stands on
          </p>
        </AnimatedSection>
        <Pillars3D />
      </div>
    </section>
  );
}
