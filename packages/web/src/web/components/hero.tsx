import { useEffect, useState } from "react";

export function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => setParallaxY(window.scrollY * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
        style={{
          backgroundImage: "url(/images/hero-bg.jpg)",
          transform: `translateY(${parallaxY}px) scale(1.1)`,
        }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-24 w-full">
        <div
          className={`transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Music Producer &middot; Singer-Songwriter
          </p>
        </div>

        <h1
          className={`transition-all duration-1000 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span
            className="gradient-text block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CARLOS
          </span>
          <span
            className="gradient-text block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PICARDO
          </span>
        </h1>

        <div
          className={`mt-8 flex items-center gap-6 transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discover More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="https://open.spotify.com/artist/pickyy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.081 20.04 8.94c.6.36.78 1.02.42 1.56-.36.48-1.08.72-1.56.36z"/>
            </svg>
            Listen on Spotify
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-primary rounded-full mt-1.5 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
