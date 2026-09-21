import { useState, useEffect } from "react";
import { AnimatedSection } from "./animated-section";
import { CoverImage } from "./cover-image";
import { type MusicProject } from "../content/projects";
import { useSongs, useContent, type Song } from "../lib/content";
import { MUSIC_DEFAULT } from "../content/defaults";

export function MusicProjects() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selected, setSelected] = useState<MusicProject | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: musicProjects = [] } = useSongs();
  const { data: c = MUSIC_DEFAULT } = useContent("music", MUSIC_DEFAULT);

  useEffect(() => {
    const set = () => setIsMobile(window.innerWidth < 768);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  // Get unique roles
  const allRoles = Array.from(
    new Set(musicProjects.flatMap((p: Song) => p.roles))
  ).sort();
  const filters = ["All", ...allRoles];

  const filtered =
    activeFilter === "All"
      ? musicProjects
      : musicProjects.filter((p: Song) => p.roles.includes(activeFilter));

  // Mobile shows 3 (1 col → 3 rows), desktop shows 4 (2 cols → 2 rows) before
  // the rest fade in behind the teal mist.
  const initialCount = isMobile ? 3 : 4;
  const canExpand = filtered.length > initialCount;
  const visible = expanded || !canExpand ? filtered : filtered.slice(0, initialCount);
  const hiddenCount = filtered.length - initialCount;

  // collapse again whenever the filter changes
  useEffect(() => {
    setExpanded(false);
  }, [activeFilter]);

  // Lock scroll when modal open + close on Escape
  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <section id="music" className="py-20 relative">
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
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.heading}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p
            className="text-muted-foreground text-lg max-w-2xl mb-12"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {c.body}
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

        {/* Grid (collapsed: last row dissolves into teal mist) */}
        <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          {visible.map((project, i) => {
            const hasMedia = project.spotify || project.youtube || project.link;
            return (
              <AnimatedSection key={project.title} delay={0.08 * Math.min(i, 6)}>
                <button
                  onClick={() => hasMedia && setSelected(project)}
                  className={`card-lift bg-card border border-white/8 rounded-xl overflow-hidden group h-full flex flex-row text-left w-full hover:border-primary/40 transition-all duration-500 ${
                    hasMedia ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Cover art */}
                  <div className="relative w-20 sm:w-44 shrink-0 overflow-hidden">
                    <CoverImage
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                    {hasMedia && (
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-7 h-7 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A0A0A">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-6 flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                      <h3
                        className="text-foreground font-bold text-sm sm:text-xl leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {project.title}
                      </h3>
                      {hasMedia && (
                        <span className="shrink-0 text-primary opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-0.5 sm:mt-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p
                      className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-none"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-2 sm:pt-3 border-t border-white/5">
                      {project.roles.slice(0, 3).map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-full"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {role}
                        </span>
                      ))}
                      {project.roles.length > 3 && (
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] text-muted-foreground">
                          +{project.roles.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            );
          })}
        </div>

          {/* Teal mist that swallows the last visible row when collapsed */}
          {canExpand && !expanded && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-52 z-10"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--background) 0%, transparent) 0%, color-mix(in srgb, var(--background) 55%, transparent) 38%, color-mix(in srgb, var(--background) 90%, transparent) 72%, var(--background) 100%), radial-gradient(120% 80% at 50% 120%, color-mix(in srgb, var(--primary) 22%, transparent) 0%, color-mix(in srgb, var(--primary) 8%, transparent) 40%, transparent 70%)",
              }}
            />
          )}
        </div>

        {/* Reveal control */}
        {canExpand && (
          <div className="relative flex justify-center mt-2">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-primary/30 bg-primary/[0.06] px-7 py-3.5 backdrop-blur-sm transition-all duration-500 hover:border-primary/70 hover:bg-primary/[0.12]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {/* drifting mist sheen */}
              <span className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 120% at 20% 50%, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 60%), radial-gradient(60% 120% at 80% 50%, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 60%)",
                  animation: "mistDrift 5s ease-in-out infinite",
                }}
              />
              <span className="relative text-xs uppercase tracking-[0.22em] text-primary">
                {expanded ? "Show less" : `See all — ${hiddenCount} more`}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`relative text-primary transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-12">
            No projects match this filter.
          </p>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-44 sm:h-56 overflow-hidden rounded-t-2xl">
              <CoverImage
                src={selected.image}
                alt={selected.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <h3
                  className="text-2xl sm:text-3xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {selected.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-1.5">
                {selected.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-full"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {role}
                  </span>
                ))}
              </div>

              <p
                className="text-muted-foreground leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {selected.description}
              </p>

              {selected.spotify && (
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.081 20.04 8.94c.6.36.78 1.02.42 1.56-.36.48-1.08.72-1.56.36z" />
                    </svg>
                    Listen on Spotify
                  </p>
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src={`https://open.spotify.com/embed/track/${selected.spotify}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`${selected.title} — Spotify`}
                  />
                </div>
              )}

              {selected.youtube && (
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Watch on YouTube
                  </p>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${selected.youtube}?rel=0`}
                      title={`${selected.title} — YouTube`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {selected.link && (
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    {selected.linkLabel || "Studio session"}
                  </p>
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Open public session
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
