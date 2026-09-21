const year = new Date().getFullYear();

const nav = [
  { label: "Listen", href: "#listen" },
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "EPR Standard", href: "#epr" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

const socials = [
  { label: "Spotify", href: "https://open.spotify.com/artist/4Opx9PV9kDvPTsNAsFERdW" },
  { label: "Instagram", href: "https://www.instagram.com/carlos.picardo/" },
  { label: "YouTube", href: "https://www.youtube.com/@carlos.picardo" },
  { label: "TikTok", href: "https://www.tiktok.com/@carlospicardo" },
  { label: "Muso.AI", href: "https://credits.muso.ai/profile/3c54b97d-3fd6-42cc-96b3-b968bbc40f12" },
  { label: "Email", href: "mailto:c.picardo27@gmail.com?subject=Inquiry%20via%20carlospicardo.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <p
              className="text-2xl font-bold tracking-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Carlos Picardo
            </p>
            <p
              className="text-muted-foreground text-sm leading-relaxed max-w-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Music producer, recording &amp; mixing engineer and
              singer-songwriter. Founder of EPR Standard.
              <br />
              <span className="text-foreground font-semibold">
                Break the f-ing box.
              </span>
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p
              className="text-xs uppercase tracking-[0.2em] text-primary mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Explore
            </p>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-4">
            <p
              className="text-xs uppercase tracking-[0.2em] text-primary mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Connect
            </p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {s.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-muted-foreground/70 text-xs text-center md:text-left"
            style={{ fontFamily: "var(--font-body)" }}
          >
            &copy; {year} Carlos Picardo. All rights reserved. All music,
            recordings, artwork and trademarks remain the property of their
            respective owners.
          </p>
          <p
            className="text-muted-foreground/50 text-xs whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Made by Carlos Picardo &middot; United Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
