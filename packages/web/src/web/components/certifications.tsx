import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { CERTS_DEFAULT } from "../content/defaults";

const ICONS = ["🎛️", "🎚️", "🎹", "🎵", "🔊"];

export function Certifications() {
  const { data: c = CERTS_DEFAULT } = useContent("certifications", CERTS_DEFAULT);
  const certs = c.items
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [name, detail = ""] = line.split("|").map((s) => s.trim());
      return {
        name,
        detail,
        icon: ICONS[i % ICONS.length],
        hasImage: /avid|pro tools/i.test(name),
      };
    });
  return (
    <section id="certs" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <AnimatedSection key={cert.name} delay={0.15 * (i + 1)}>
              <div className="card-lift bg-card border border-white/5 rounded-lg p-6 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    {cert.hasImage ? (
                      <img
                        src="/images/avid-cert.png"
                        alt="Avid Certification"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-xl">
                        {cert.icon}
                      </div>
                    )}
                    <div>
                      <h3
                        className="text-foreground font-semibold text-lg"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {cert.name}
                      </h3>
                      <p
                        className="text-muted-foreground text-sm"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {cert.detail}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
