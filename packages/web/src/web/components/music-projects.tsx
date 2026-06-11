import { useState } from "react";
import { AnimatedSection } from "./animated-section";
import { musicProjects } from "../content/projects";

export function MusicProjects() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Get unique roles
  const allRoles = Array.from(
    new Set(musicProjects.flatMap((p) => p.roles))
  ).sort();
  const filters = ["All", ...allRoles];

  const filtered =
    activeFilter === "All"
      ? musicProjects
      : musicProjects.filter((p) => p.roles.includes(activeFilter));

  return (
    <section id="music" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discography
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Music Projects
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p
            className="text-muted-foreground text-lg max-w-2xl mb-12"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A selection of songs and collaborations I've produced, recorded, and
            mixed.
          </p>
        </AnimatedSection>

        {/* Filter pills */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider border rounded-full transition-all duration-300 cursor-pointer ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {f}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <AnimatedSection key={project.title} delay={0.1 * Math.min(i, 5)}>
              <div className="card-lift bg-card border border-white/5 rounded-lg overflow-hidden group h-full flex flex-col">
                {/* Cover art */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#0A0A0A"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3
                    className="text-foreground font-semibold text-lg mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-12">
            No projects match this filter.
          </p>
        )}
      </div>
    </section>
  );
}
