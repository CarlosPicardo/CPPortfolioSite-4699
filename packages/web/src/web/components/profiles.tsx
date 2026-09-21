import { AnimatedSection } from "./animated-section";

const profiles = [
  {
    label: "Production & Engineering",
    desc: "Recording, mixing & producing for artists across pop, rock, folk and urban.",
    href: "#music",
    external: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    label: "Artist",
    desc: "My own music as a singer-songwriter. Original songs, written and produced by me.",
    href: "#listen",
    external: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    label: "EPR Standard",
    desc: "The framework I founded for recognising the people who shape the sound of recorded music.",
    href: "#epr",
    external: false,
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <path d="M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
      </svg>
    ),
  },
];

export function Profiles() {
  return (
    <section id="profiles" className="py-24 relative border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Three Worlds
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h2
            className="text-3xl md:text-5xl font-bold mb-8 sm:mb-12 leading-tight text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where would you like to start?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((p, i) => (
            <AnimatedSection key={p.label} delay={0.12 * (i + 1)}>
              <a
                href={p.href}
                className="group relative block h-full overflow-hidden rounded-xl border border-white/8 bg-card p-5 sm:p-6 transition-all duration-500 hover:border-primary/50 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-primary mb-3 sm:mb-4 [&_svg]:w-6 [&_svg]:h-6 sm:[&_svg]:w-7 sm:[&_svg]:h-7">{p.icon}</div>
                  <h3
                    className="text-lg sm:text-xl font-bold mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.label}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-5 flex-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {p.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Explore
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
