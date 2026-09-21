import { useEffect, useRef, useState } from "react";

/**
 * Break The Box — cinematic intro overlay.
 * A 3D cardboard box rotates, shakes, then explodes into shards revealing
 * "BREAK THE BOX / don't think outside it". Auto-plays on load and also
 * reacts to scroll. Fades out to reveal the page. Optional impact sound.
 */

const SHARD_COUNT = 16;

// Pre-computed random-ish explosion vectors (deterministic so SSR-safe-ish)
const shards = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const angle = (i / SHARD_COUNT) * Math.PI * 2 + (i % 3) * 0.4;
  const dist = 380 + ((i * 53) % 260);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 60,
    rot: ((i * 67) % 720) - 360,
    rotX: ((i * 91) % 540) - 270,
    delay: (i % 6) * 0.012,
    size: 36 + ((i * 29) % 70),
    bright: 0.7 + ((i * 13) % 30) / 100,
  };
});

export function BreakTheBoxIntro() {
  // phases: 0 idle/assemble -> 1 shake -> 2 explode -> 3 text -> 4 fading -> 5 done
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(true);
  const [scrollBoost, setScrollBoost] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto cinematic timeline
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase(1), 1000); // shake
    const t2 = setTimeout(() => {
      setPhase(2); // explode
      if (!muted && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 1700);
    const t3 = setTimeout(() => setPhase(3), 2350); // text reveal (after shards spread)
    const t4 = setTimeout(() => {
      document.body.style.overflow = "";
      setPhase(4); // start fade
    }, 4800);
    const t5 = setTimeout(() => {
      setDone(true);
      setPhase(5);
    }, 5800);
    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll reactivity (pushes shards further / parallax on text before fade)
  useEffect(() => {
    if (done) return;
    const onScroll = () => setScrollBoost(Math.min(window.scrollY, 600));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  if (done) return null;

  const exploded = phase >= 2;
  const showText = phase >= 3;
  const fading = phase >= 4;
  const boost = scrollBoost / 600; // 0..1

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0A0A0A] transition-opacity duration-1000 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ perspective: "1200px" }}
    >
      <audio ref={audioRef} src="/audio/break.mp3" preload="auto" />

      {/* Radial glow that flashes on explosion */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500"
        style={{
          width: exploded ? "140vmax" : "0vmax",
          height: exploded ? "140vmax" : "0vmax",
          background:
            "radial-gradient(circle, rgba(0,212,170,0.18) 0%, rgba(0,212,170,0.05) 30%, transparent 60%)",
          opacity: exploded && !fading ? 1 : 0,
        }}
      />

      {/* THE BOX (3D) */}
      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: exploded
            ? "scale(1.35)"
            : phase === 1
            ? "rotateX(-18deg) rotateY(35deg) scale(1)"
            : "rotateX(-18deg) rotateY(-20deg) scale(0.9)",
          transition: exploded
            ? "transform 0.18s ease-out, opacity 0.18s ease-out"
            : "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          animation:
            phase === 1 ? "boxShake 0.12s linear infinite" : phase === 0 ? "boxFloat 3s ease-in-out infinite" : "none",
          opacity: exploded ? 0 : 1,
        }}
      >
        <Box />
      </div>

      {/* SHARDS */}
      {shards.map((s, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: s.size,
            height: s.size * 0.78,
            marginLeft: -s.size / 2,
            marginTop: -s.size / 2,
            transformStyle: "preserve-3d",
            transform: exploded
              ? `translate3d(${s.x * (1 + boost * 0.6)}px, ${
                  s.y * (1 + boost * 0.6)
                }px, 0) rotateZ(${s.rot}deg) rotateX(${s.rotX}deg) scale(1)`
              : "translate3d(0,0,0) rotateZ(0deg) scale(0.4)",
            opacity: exploded ? (fading ? 0 : 1) : 0,
            transition: exploded
              ? `transform 0.9s cubic-bezier(0.12,0.9,0.2,1) ${s.delay}s, opacity ${
                  fading ? "0.5s" : "0.08s"
                } ease`
              : "none",
            background: `linear-gradient(135deg, rgba(196,138,84,${s.bright}) 0%, rgba(132,89,50,${s.bright}) 100%)`,
            borderRadius: 3,
            boxShadow: "inset 0 0 0 1px rgba(90,58,30,0.7), 0 8px 22px rgba(0,0,0,0.55)",
          }}
        />
      ))}

      {/* TEXT REVEAL */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{
          transform: `translateY(${showText ? -boost * 120 : 0}px)`,
          opacity: showText ? 1 - boost * 0.8 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <h1
          className="font-bold leading-[0.85] tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 13vw, 11rem)",
          }}
        >
          <span
            className={`block ${showText ? "animate-[slamIn_0.5s_cubic-bezier(0.2,1.4,0.4,1)_both]" : ""}`}
          >
            BREAK
          </span>
          <span
            className={`block gradient-text ${
              showText ? "animate-[slamIn_0.5s_cubic-bezier(0.2,1.4,0.4,1)_0.12s_both]" : ""
            }`}
          >
            THE BOX
          </span>
        </h1>
        <p
          className={`mt-5 text-muted-foreground uppercase tracking-[0.35em] text-xs sm:text-base ${
            showText ? "animate-[fadeUp_0.6s_ease_0.5s_both]" : ""
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          don't think outside it
        </p>
      </div>

      {/* Skip + Sound controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
        <button
          onClick={() => {
            setMuted((m) => {
              const next = !m;
              if (!next && audioRef.current && phase < 2) {
                // unmuting before explosion: it'll play on cue
              }
              return next;
            });
          }}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-primary hover:border-primary transition-colors backdrop-blur-sm"
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        <button
          onClick={() => {
            document.body.style.overflow = "";
            setPhase(5);
            setDone(true);
          }}
          className="text-white/50 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

/** A cardboard box built from CSS 3D faces. */
function Box() {
  const S = 150; // size
  const face = (style: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: S,
        height: S,
        left: "50%",
        top: "50%",
        marginLeft: -S / 2,
        marginTop: -S / 2,
        background:
          "linear-gradient(135deg, #c08a52 0%, #9a6b43 55%, #7c5430 100%)",
        boxShadow: "inset 0 0 0 2px rgba(80,52,28,0.55)",
        ...style,
      }}
    >
      {/* tape line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 26,
          height: "100%",
          marginLeft: -13,
          background: "rgba(220,205,180,0.25)",
          borderLeft: "1px solid rgba(255,255,255,0.12)",
          borderRight: "1px solid rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
  return (
    <div style={{ width: S, height: S, transformStyle: "preserve-3d", position: "relative" }}>
      {face({ transform: `translateZ(${S / 2}px)` })}
      {face({ transform: `rotateY(180deg) translateZ(${S / 2}px)` })}
      {face({ transform: `rotateY(90deg) translateZ(${S / 2}px)`, filter: "brightness(0.82)" })}
      {face({ transform: `rotateY(-90deg) translateZ(${S / 2}px)`, filter: "brightness(0.82)" })}
      {face({ transform: `rotateX(90deg) translateZ(${S / 2}px)`, filter: "brightness(1.1)" })}
      {face({ transform: `rotateX(-90deg) translateZ(${S / 2}px)`, filter: "brightness(0.62)" })}
    </div>
  );
}
