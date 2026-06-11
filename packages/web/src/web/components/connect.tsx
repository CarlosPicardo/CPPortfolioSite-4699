import { AnimatedSection } from "./animated-section";

const socials = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/",
    color: "#1DB954",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.081 20.04 8.94c.6.36.78 1.02.42 1.56-.36.48-1.08.72-1.56.36z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/carlos.picardo/",
    color: "#E4405F",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/",
    color: "#FF0000",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@carlospicardo75",
    color: "#00F2EA",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

export function Connect() {
  return (
    <section id="connect" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Let's Connect
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find me on
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p
            className="text-muted-foreground text-lg text-center max-w-xl mx-auto mb-16"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Follow my journey as a music producer and stay up to date with new releases, studio sessions, and creative projects.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {socials.map((s, i) => (
            <AnimatedSection key={s.name} delay={0.15 * (i + 1)}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift bg-card border border-white/5 rounded-lg p-6 flex flex-col items-center gap-4 group hover:border-white/20 transition-all duration-500"
              >
                <div
                  className="transition-all duration-500 text-muted-foreground group-hover:scale-110"
                  style={{ color: undefined }}
                >
                  <div className="group-hover:hidden">{s.icon}</div>
                  <div className="hidden group-hover:block" style={{ color: s.color }}>
                    {s.icon}
                  </div>
                </div>
                <span
                  className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.name}
                </span>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* Spotify embed section */}
        <AnimatedSection delay={0.5}>
          <div className="mt-20 max-w-xl mx-auto">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/6trQ9txMRaGwS9rtSGr9mS?utm_source=generator&theme=0"
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
