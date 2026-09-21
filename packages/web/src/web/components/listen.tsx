import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { useField } from "../lib/i18n";
import { LISTEN_DEFAULT } from "../content/defaults";

export function Listen() {
  const { data: c = LISTEN_DEFAULT } = useContent("listen", LISTEN_DEFAULT);
  const f = useField(c);
  return (
    <section id="listen" className="pt-10 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {c.eyebrow}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.heading}
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <p
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-14 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {f("body")}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Work by CP — productions & engineering */}
          <AnimatedSection delay={0.2}>
            <div className="rounded-xl border border-white/8 bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <p
                  className="text-sm uppercase tracking-[0.2em] text-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Work by CP — Production & Engineering
                </p>
              </div>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/playlist/6trQ9txMRaGwS9rtSGr9mS?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Work by CP — Production & Engineering"
              />
            </div>
          </AnimatedSection>

          {/* Artist profile */}
          <AnimatedSection delay={0.3}>
            <div className="rounded-xl border border-white/8 bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <p
                  className="text-sm uppercase tracking-[0.2em] text-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Carlos Picardo — Artist
                </p>
              </div>
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/artist/4Opx9PV9kDvPTsNAsFERdW?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Carlos Picardo — Artist"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Muso.AI verified credits */}
        <AnimatedSection delay={0.2}>
          <div className="mt-6 flex justify-center">
            <a
              href="https://credits.muso.ai/profile/3c54b97d-3fd6-42cc-96b3-b968bbc40f12"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-card px-6 py-3 hover:border-primary/50 transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <img
                src="/images/muso-icon.png"
                alt="Muso.AI"
                className="h-6 w-6 rounded-md flex-shrink-0"
              />
              <span className="text-sm text-foreground">
                See my verified credits on{" "}
                <span className="text-primary font-semibold">Muso.AI</span>
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
