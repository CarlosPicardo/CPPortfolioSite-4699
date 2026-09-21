const items = [
  { label: "Listen", href: "#listen" },
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "EPR Standard", href: "#epr" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

export function QuickNav() {
  return (
    <section className="relative pt-2 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {items.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="px-4 sm:px-5 py-2 text-[11px] sm:text-xs uppercase tracking-[0.15em] rounded-full border border-white/30 bg-white/[0.06] text-white/90 backdrop-blur-sm shadow-[0_2px_18px_rgba(0,0,0,0.35)] hover:text-primary hover:border-primary/70 hover:bg-primary/10 transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
