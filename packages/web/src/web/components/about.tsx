import { AnimatedSection } from "./animated-section";

export function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image column */}
          <AnimatedSection className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-lg blur-2xl" />
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/images/profile.jpg"
                  alt="Carlos Picardo"
                  className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 to-transparent" />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-primary/30 rounded-lg" />
            </div>
          </AnimatedSection>

          {/* Text column */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <p
                className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                About Me
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2
                className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Crafting sound<br />
                <span className="text-primary">with intention</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p
                className="text-muted-foreground text-lg leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-body)" }}
              >
                I'm a young music producer with hands-on experience in professional studios and a strong artistic background. My approach combines technical precision with emotional understanding, shaped by my early years as a singer-songwriter.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex flex-wrap gap-3 mt-8">
                {["Production", "Mixing", "Mastering", "Songwriting", "Creative Direction", "Sound Design"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 border border-white/10 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-default"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
