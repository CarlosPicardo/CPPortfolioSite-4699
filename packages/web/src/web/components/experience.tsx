import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { EXPERIENCE_DEFAULT } from "../content/defaults";

export function Experience() {
  const { data: c = EXPERIENCE_DEFAULT } = useContent(
    "experience",
    EXPERIENCE_DEFAULT,
  );
  const bullets = c.bullets.split("\n").map((b) => b.trim()).filter(Boolean);
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {c.eyebrow}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-5xl font-bold mb-16 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.heading}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text */}
          <div className="lg:col-span-7">
            <AnimatedSection delay={0.2}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.studio}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {c.location}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p
                className="text-muted-foreground text-lg leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {c.body}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="space-y-4">
                {bullets.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 shrink-0" />
                    <p
                      className="text-muted-foreground leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Studio image */}
          <AnimatedSection className="lg:col-span-5" delay={0.3}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-lg blur-2xl" />
              <div className="relative overflow-hidden rounded-lg card-lift">
                <img
                  src={c.image}
                  alt={c.studio}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p
                    className="text-foreground text-sm font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.studio}
                  </p>
                  <p
                    className="text-muted-foreground text-xs"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {c.location.split("·")[0].trim()}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
