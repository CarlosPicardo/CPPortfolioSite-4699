import { AnimatedSection } from "./animated-section";
import { projects } from "../content/projects";

export function Projects() {
  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Other Work
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p
            className="text-muted-foreground text-lg max-w-2xl mb-16"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Academic and creative projects spanning Dolby Atmos, foley, game
            audio, and community building.
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={0.1 * Math.min(i, 4)}>
              <div className="card-lift bg-card border border-white/5 rounded-lg overflow-hidden group">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Image */}
                  <div className="md:col-span-4 relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover aspect-video md:aspect-auto md:min-h-[220px] transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-center">
                    <h3
                      className="text-foreground font-semibold text-xl md:text-2xl mb-3 leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-muted-foreground leading-relaxed mb-5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs uppercase tracking-wider border border-white/10 text-muted-foreground rounded hover:border-primary/50 hover:text-primary transition-all duration-300"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
