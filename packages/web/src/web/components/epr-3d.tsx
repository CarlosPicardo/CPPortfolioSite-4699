import { useEffect, useRef, useState } from "react";

const EPR = {
  cream: "#f2ede4",
  creamMuted: "#a89880",
  copper: "#9a6b43",
  copperLight: "#c4986a",
  panel: "#221a14",
};

/* ------------------------------------------------------------------ */
/* 3D EPR LOGO — tilts with mouse + scroll, with depth & shine sweep   */
/* ------------------------------------------------------------------ */
export function Logo3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 as it enters viewport
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  // scroll-driven entrance progress
  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when element bottom enters, 1 when it's comfortably centered
      const p = 1 - Math.min(1, Math.max(0, (r.top + r.height * 0.3) / vh));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // mouse-driven tilt
  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2, // -1..1
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    };
  };
  const onLeave = () => (target.current = { x: 0, y: 0 });

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      mouse.current.x += (target.current.x - mouse.current.x) * 0.08;
      mouse.current.y += (target.current.y - mouse.current.y) * 0.08;

      // automatic gentle 3D orbit (figure-8 / Lissajous) — always alive
      const t = (now - start) / 1000;
      const autoY = Math.sin(t * 0.55) * 13; // deg, slow horizontal sway
      const autoX = Math.sin(t * 0.8 + 1.2) * 7; // faster, smaller vertical bob

      const s = sceneRef.current;
      if (s) {
        // mouse exaggerates direction & amount on top of the auto-orbit
        const rotY = autoY + mouse.current.x * 22;
        const rotX = autoX - mouse.current.y * 16;
        s.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // entrance transforms
  const assemble = (z: number, dx: number, dy: number, delay: number) => {
    const p = Math.min(1, Math.max(0, (progress - delay) / (1 - delay || 1)));
    const ease = 1 - Math.pow(1 - p, 3);
    return {
      transform: `translate3d(${dx * (1 - ease)}px, ${dy * (1 - ease)}px, ${z}px)`,
      opacity: ease,
    };
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto mb-10 w-full max-w-[460px] md:max-w-[560px]"
      style={{ perspective: "1100px" }}
    >
      <div
        ref={sceneRef}
        className="relative"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* deep shadow / extrusion layers behind the logo (fake 3D depth) */}
        {[14, 10, 6, 3].map((d, i) => (
          <img
            key={d}
            src="/images/epr/classic-full-white.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-auto select-none"
            draggable={false}
            style={{
              transform: `translateZ(${-d * 3}px)`,
              filter: `brightness(${0.18 + i * 0.05}) blur(${(4 - i) * 0.4}px)`,
              opacity: 0.55,
              ...assemble(-d * 3, 0, 18 + d, 0.05 * i),
            }}
          />
        ))}

        {/* front face */}
        <div style={{ transformStyle: "preserve-3d", ...assemble(0, 0, 0, 0.2) }}>
          <img
            src="/images/epr/classic-full-white.png"
            alt="EPR Standard"
            className="relative w-full h-auto select-none"
            draggable={false}
            style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))" }}
          />
          {/* metallic shine sweep */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(196,152,106,0.55) 47%, rgba(255,255,255,0.65) 50%, rgba(196,152,106,0.55) 53%, transparent 70%)",
              backgroundSize: "250% 100%",
              backgroundPositionX: `${100 - progress * 160}%`,
              WebkitMaskImage: "url(/images/epr/classic-full-white.png)",
              maskImage: "url(/images/epr/classic-full-white.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>

        {/* copper glow floor */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] pointer-events-none"
          style={{
            width: "80%",
            height: "70%",
            background: "rgba(154,107,67,0.35)",
            transform: "translateZ(-60px)",
            opacity: progress,
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3D PILLARS — four floating cards that rotate on scroll + hover      */
/* ------------------------------------------------------------------ */
const pillars = [
  { n: "01", label: "Music", desc: "The recorded work at the centre of everything." },
  { n: "02", label: "Metadata", desc: "Documenting who did what, with precision." },
  { n: "03", label: "Rights", desc: "Valuing each creative contribution fairly." },
  { n: "04", label: "Sonic Authorship", desc: "Recognising who shaped the sound." },
];

export function Pillars3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // scroll progress through the block

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = 1 - Math.min(1, Math.max(0, (r.top + r.height * 0.2) / (vh * 0.9)));
      setP(prog);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      style={{ perspective: "1400px" }}
    >
      {pillars.map((pill, i) => {
        const local = Math.min(1, Math.max(0, (p - i * 0.08) / 0.5));
        const ease = 1 - Math.pow(1 - local, 3);
        const rotX = (1 - ease) * 45;
        const ty = (1 - ease) * 60;
        return (
          <Pillar3DCard
            key={pill.label}
            n={pill.n}
            label={pill.label}
            desc={pill.desc}
            style={{
              transform: `translateY(${ty}px) rotateX(${rotX}deg)`,
              opacity: ease,
            }}
          />
        );
      })}
    </div>
  );
}

function Pillar3DCard({
  n,
  label,
  desc,
  style,
}: {
  n: string;
  label: string;
  desc: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    };
  };
  const onLeave = () => (target.current = { x: 0, y: 0 });

  useEffect(() => {
    const tick = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.1;
      cur.current.y += (target.current.y - cur.current.y) * 0.1;
      const el = inner.current;
      if (el) {
        el.style.transform = `rotateY(${cur.current.x * 10}deg) rotateX(${-cur.current.y * 10}deg) translateZ(0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: "800px", ...style }}
      className="transition-[transform,opacity] duration-300 ease-out"
    >
      <div
        ref={inner}
        className="h-full rounded-xl p-7 relative overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: EPR.panel,
          border: `1px solid ${EPR.copper}40`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(154,107,67,0.25)" }}
        />
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: EPR.copperLight, fontFamily: "'Space Mono', monospace" }}
        >
          {n}
        </p>
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: EPR.cream }}
        >
          {label}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: EPR.creamMuted }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
