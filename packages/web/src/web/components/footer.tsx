export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-muted-foreground text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          &copy; {new Date().getFullYear()} Carlos Picardo. All rights reserved.
        </p>
        <p
          className="text-muted-foreground/50 text-xs"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Music Producer &middot; Singer-Songwriter &middot; Founder of Aqueo Records
        </p>
      </div>
    </footer>
  );
}
