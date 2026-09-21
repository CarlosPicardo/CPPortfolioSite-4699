import { useEffect, useRef, useState } from "react";
import { useContent } from "../lib/content";

interface HeroContent {
  eyebrow?: string;
  image?: string;
}

const SHARD_COUNT = 24;
const shards = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const angle = (i / SHARD_COUNT) * Math.PI * 2 + (i % 3) * 0.4;
  const dist = 200 + ((i * 53) % 200);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 30,
    rot: ((i * 67) % 720) - 360,
    rotX: ((i * 91) % 360) - 180,
    delay: (i % 6) * 0.012,
    size: 32 + ((i * 29) % 54),
    bright: 0.65 + ((i * 13) % 30) / 100,
  };
});

export function Hero() {
  const { data: hero = {} } = useContent<HeroContent>("hero", {});
  const [loaded, setLoaded] = useState(false);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden flex flex-col pb-0 sm:pb-4 min-h-[100svh] sm:min-h-0">
      {/* darkening + noise only — the console image lives in the shared wrapper
          (index.tsx) so it flows continuously into the sections below */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/0 via-background/55 to-background/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Content — name + role only. Mystery, space, nothing else above the fold. */}
      <div
        className="relative z-10 max-w-[1200px] mx-auto px-6 w-full flex flex-col items-center sm:items-start text-center sm:text-left pt-32 sm:pt-32"
      >
        <h1
          className={`transition-all duration-1000 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span
            className="gradient-text block font-bold leading-[0.88] tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.2rem, 16vw, 9rem)" }}
          >
            CARLOS
          </span>
          <span
            className="gradient-text block font-bold leading-[0.88] tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.2rem, 16vw, 9rem)" }}
          >
            PICARDO
          </span>
        </h1>

        {/* Role — sits BELOW the name */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p
            className="text-primary text-xs sm:text-sm uppercase tracking-[0.35em] mt-4 sm:mt-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {hero.eyebrow || "Producer, Engineer, Artist"}
          </p>
        </div>
      </div>

      {/* Interactive Break-the-box strip */}
      <BreakBox loaded={loaded} exploded={exploded} setExploded={setExploded} />
    </section>
  );
}

function BreakBox({
  loaded,
  exploded,
  setExploded,
}: {
  loaded: boolean;
  exploded: boolean;
  setExploded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [rebuilding, setRebuilding] = useState(false);
  const [reset, setReset] = useState(0);
  const breakAudio = useRef<HTMLAudioElement | null>(null);
  const rebuildAudio = useRef<HTMLAudioElement | null>(null);

  const handleBreak = () => {
    if (exploded || rebuilding) return;
    setExploded(true);
    if (breakAudio.current) {
      breakAudio.current.currentTime = 0;
      breakAudio.current.volume = 0.9;
      breakAudio.current.play().catch(() => {});
    }
  };

  const handleReset = () => {
    if (rebuilding) return;
    setRebuilding(true);
    // Play rebuild audio BEFORE remounting — grab src directly to avoid ref loss
    const audio = new Audio("/audio/rebuild.mp3");
    audio.volume = 0.85;
    audio.play().catch(() => {});
    setTimeout(() => {
      setExploded(false);
      setReset((r) => r + 1);
      setRebuilding(false);
    }, 900);
  };

  return (
    <div
      className={`relative z-10 w-full pb-2 sm:pb-6 transition-all duration-1000 delay-[900ms] ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Audio elements outside the keyed div so they never get remounted */}
      <audio ref={breakAudio} src="/audio/break.mp3" preload="auto" />
      <audio ref={rebuildAudio} src="/audio/rebuild.mp3" preload="auto" />

      <div
        key={reset}
        className="relative mx-auto w-full max-w-[1200px] px-6 h-[280px] sm:h-[380px] flex items-center justify-center mt-0 sm:mt-2"
        style={{ perspective: "1400px" }}
      >
        {/* teal glow flash on break */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 pointer-events-none"
          style={{
            width: exploded && !rebuilding ? "120vmax" : "0",
            height: exploded && !rebuilding ? "120vmax" : "0",
            background:
              "radial-gradient(circle, rgba(0,212,170,0.16) 0%, rgba(0,212,170,0.05) 35%, transparent 60%)",
            opacity: exploded && !rebuilding ? 1 : 0,
          }}
        />

        {/* The box (clickable) — caption ABOVE, well separated, recedes backward on break */}
        {(!exploded || rebuilding) && (
          <button
            onClick={handleBreak}
            disabled={rebuilding}
            className="group relative flex flex-col items-center gap-10 sm:gap-14 cursor-pointer"
            aria-label="Break the box"
            style={{
              perspective: "900px",
              animation: rebuilding ? "rebuildPop 0.9s cubic-bezier(0.2,1.3,0.4,1) both" : "none",
            }}
          >
            <span
              className="text-[11px] sm:text-sm uppercase tracking-[0.25em] text-muted-foreground group-hover:text-primary transition-colors text-center max-w-[300px] sm:max-w-[360px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Many think inside the box,{" "}
              <span className="text-foreground font-semibold">but I…</span>
            </span>
            <div
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                animation: rebuilding ? "none" : "boxFloat 3.5s ease-in-out infinite",
              }}
            >
              <MiniBox />
            </div>
          </button>
        )}

        {/* Cardboard shards — static positions, no drift */}
        {shards.map((s, i) => (
          <div
            key={`shard-${i}`}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: s.size,
              height: s.size * 0.78,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, rgba(196,138,84,${s.bright}) 0%, rgba(132,89,50,${s.bright}) 100%)`,
              boxShadow: "inset 0 0 0 1px rgba(90,58,30,0.6), 0 4px 12px rgba(0,0,0,0.4)",
              transformStyle: "preserve-3d",
              transform:
                exploded && !rebuilding
                  ? `translate3d(${s.x}px, ${s.y}px, 0) rotateZ(${s.rot}deg) rotateX(${s.rotX}deg) scale(1)`
                  : "translate3d(0,0,0) scale(0.3)",
              opacity: exploded && !rebuilding ? 0.55 : 0,
              transition:
                exploded && !rebuilding
                  ? `transform 0.9s cubic-bezier(0.12,0.9,0.2,1) ${s.delay}s, opacity 0.4s ease ${s.delay}s`
                  : "transform 0.5s cubic-bezier(0.6,0,0.4,1), opacity 0.3s ease",
            }}
          />
        ))}

        {/* Slogan reveal — BREAK THE BOX dominates. Subline sits below and
            leans FORWARD on hover, hides again when you leave. */}
        {exploded && !rebuilding && (
          <div
            className="group/slogan absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            style={{ perspective: "1100px" }}
          >
            <h2
              className="font-bold leading-[0.85] tracking-tight pointer-events-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.6rem, 11vw, 5rem)",
              }}
            >
              <span className="gradient-text-red block animate-[slamIn_0.5s_cubic-bezier(0.2,1.4,0.4,1)_both]">
                BREAK
              </span>
              <span className="gradient-text block animate-[slamIn_0.5s_cubic-bezier(0.2,1.4,0.4,1)_0.1s_both]">
                THE BOX
              </span>
            </h2>
            <p
              className="mt-4 sm:mt-6 max-w-[460px] leading-relaxed tracking-[0.08em] text-[11px] sm:text-sm text-white/30 italic transition-all duration-500 group-hover/slogan:text-white/60 group-hover/slogan:[transform:translateZ(40px)] animate-[fadeUp_0.6s_ease_0.55s_both]"
              style={{ fontFamily: "var(--font-body)", transformStyle: "preserve-3d" }}
            >
              Others think outside the box, but I say —{" "}
              <span className="text-white/60 not-italic">break it!</span>
            </p>
          </div>
        )}

        {/* Rebuild button */}
        {exploded && !rebuilding && (
          <button
            onClick={handleReset}
            className="absolute bottom-2 right-6 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors animate-[fadeUp_0.6s_ease_1.2s_both] pointer-events-auto"
            style={{ fontFamily: "var(--font-body)" }}
            aria-label="Rebuild box"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            rebuild
          </button>
        )}
      </div>
    </div>
  );
}

function MiniBox() {
  // Closed cardboard cube. Smaller on mobile (must stay under the CARLOS PICARDO text).
  const [S, setS] = useState(120);
  useEffect(() => {
    const set = () => setS(window.innerWidth < 640 ? 148 : 168);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const face = (style: React.CSSProperties, dim?: number) => (
    <div
      style={{
        position: "absolute",
        width: S,
        height: S,
        left: "50%",
        top: "50%",
        marginLeft: -S / 2,
        marginTop: -S / 2,
        background: "linear-gradient(135deg, #c08a52 0%, #9a6b43 55%, #7c5430 100%)",
        boxShadow: "inset 0 0 0 2px rgba(80,52,28,0.55)",
        filter: dim ? `brightness(${dim})` : undefined,
        ...style,
      }}
    >
      {/* center tape seam on top + front */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: Math.max(18, S * 0.16),
          height: "100%",
          marginLeft: -Math.max(18, S * 0.16) / 2,
          background: "rgba(220,205,180,0.2)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        width: S,
        height: S,
        transformStyle: "preserve-3d",
        position: "relative",
        transform: "rotateX(-22deg) rotateY(-26deg)",
      }}
      className="group-hover:[transform:rotateX(-22deg)_rotateY(14deg)] transition-transform duration-500"
    >
      {/* front / back */}
      {face({ transform: `translateZ(${S / 2}px)` })}
      {face({ transform: `rotateY(180deg) translateZ(${S / 2}px)` })}
      {/* sides */}
      {face({ transform: `rotateY(90deg) translateZ(${S / 2}px)` }, 0.82)}
      {face({ transform: `rotateY(-90deg) translateZ(${S / 2}px)` }, 0.82)}
      {/* top (closed) / bottom */}
      {face({ transform: `rotateX(90deg) translateZ(${S / 2}px)` }, 1.08)}
      {face({ transform: `rotateX(-90deg) translateZ(${S / 2}px)` }, 0.5)}
    </div>
  );
}
