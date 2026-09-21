import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Listen", href: "#listen" },
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "EPR Standard", href: "#epr" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-nav-solid border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className={`max-w-[1200px] mx-auto px-6 h-16 items-center justify-between relative ${menuOpen ? "hidden md:flex" : "flex"}`}>
        {/* CP — left (hidden on desktop when the menu bar is open) */}
        <a
          href="#"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5 text-foreground hover:opacity-80 transition-opacity"
        >
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CP
          </span>
        </a>

        {/* Desktop full-width inline menu bar — sits IN the header */}
        <div
          className={`hidden md:flex absolute left-0 right-0 px-6 items-center justify-center gap-1 transition-all duration-300 ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm nav-link hover:text-primary transition-colors duration-300 uppercase px-4 py-2 whitespace-nowrap"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.12em" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right cluster: theme toggle + hamburger */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {/* Toggle — right (hamburger / X) */}
          <button
            className="flex flex-col justify-center gap-1.5 p-2 z-50 w-10 h-10 items-center"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
          </button>
        </div>
      </div>

      {/* Mobile full overlay — opaque, theme-aware */}
      <div
        className={`md:hidden fixed inset-0 bg-nav-overlay transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 50 }}
      >
        {/* CP always visible at top-left inside the overlay */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CP
          </a>
          <button
            className="flex flex-col justify-center gap-1.5 p-2 w-10 h-10 items-center"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-foreground rotate-45 translate-y-2" />
            <span className="block w-6 h-0.5 bg-foreground opacity-0" />
            <span className="block w-6 h-0.5 bg-foreground -rotate-45 -translate-y-2" />
          </button>
        </div>
        <div className="flex flex-col items-start gap-0 px-8 pt-8 pb-10">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-foreground text-3xl font-bold uppercase tracking-wide py-4 border-b border-border w-full transition-all duration-300 hover:text-primary"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateX(0)" : "translateX(-16px)",
                transitionDelay: menuOpen ? `${0.04 + i * 0.05}s` : "0s",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
