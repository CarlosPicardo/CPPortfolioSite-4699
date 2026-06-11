import { AnimatedSection } from "./animated-section";

export function Aqueo() {
  return (
    <section id="aqueo" className="py-32 relative">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Featured Project
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-6xl font-bold mb-16 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Aqueo Records
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Logo & visual */}
          <AnimatedSection className="lg:col-span-5" delay={0.2}>
            <div className="card-lift bg-card border border-white/5 rounded-lg overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px] relative">
              <div className="absolute inset-0 noise-overlay opacity-50" />
              <img
                src="/images/aqueo-logo.png"
                alt="Aqueo Records"
                className="w-48 h-48 object-contain relative z-10 mb-6"
              />
              <a
                href="https://aqueorecords.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 text-primary text-sm uppercase tracking-wider hover:underline transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Visit Website
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </AnimatedSection>

          {/* Description */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatedSection delay={0.2}>
              <p
                className="text-muted-foreground text-lg leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Aqueo Records is an independent label and creative platform I founded to support emerging artists with a clear vision and a strong artistic identity. The project was born out of a need I personally experienced as an artist and producer: the desire for a space where music is treated with care, honesty, and professional ambition — beyond trends, algorithms, or commercial shortcuts.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p
                className="text-muted-foreground leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                The name "Aqueo" draws inspiration from the ancient Achaeans, symbolising strength, resilience, and creative legacy. With that spirit, Aqueo Records aims to nurture projects that carry emotional weight, sonic depth, and long-term artistic value.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {[
                  { label: "Services", items: "Production, Mixing, Mastering" },
                  { label: "Focus", items: "Pop, Alt Rock, Folk, Urban" },
                  { label: "Vision", items: "Creative Freedom + Excellence" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-l-2 border-primary/30 pl-4"
                  >
                    <p
                      className="text-primary text-xs uppercase tracking-wider mb-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-muted-foreground text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.items}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <blockquote
                className="mt-8 border-l-2 border-primary pl-6 text-foreground/80 italic text-lg"
                style={{ fontFamily: "var(--font-body)" }}
              >
                "Bridging the gap between creative freedom and professional excellence — a home for timeless, emotionally driven music."
              </blockquote>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
