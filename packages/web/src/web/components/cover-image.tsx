import { useEffect, useState } from "react";

/**
 * Image that never looks broken.
 *
 * Why this exists: covers uploaded through /admin live in R2 and are served
 * through /api/media/:key. On flaky mobile networks a single request can be
 * dropped, and the browser then renders the "broken image" icon permanently.
 * This component retries once with a cache-busting param, and if that still
 * fails it renders a branded placeholder (initials on a gradient) instead.
 */
export function CoverImage({
  src,
  alt,
  className = "",
  style,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  // Reset when the source changes (e.g. filtering the discography).
  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  const label = (fallbackLabel ?? alt ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (!src || failed) {
    return (
      <div
        className={`${className} flex items-center justify-center`}
        style={{
          ...style,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent), rgba(0,0,0,0.55))",
        }}
        aria-label={alt}
        role="img"
      >
        <span className="font-display text-lg sm:text-2xl tracking-wider text-foreground/60">
          {label || "♪"}
        </span>
      </div>
    );
  }

  return (
    <img
      // key forces a fresh request on retry
      key={attempt}
      src={attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}r=${attempt}`}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
      onError={() => {
        if (attempt < 1) setAttempt((a) => a + 1);
        else setFailed(true);
      }}
    />
  );
}
