import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { useField } from "../lib/i18n";
import { ABOUT_DEFAULT } from "../content/defaults";

// Render body text, bolding known proper nouns to match the original design.
function richText(text: string) {
  const highlights = ["Sonic Live Studios in Vienna", "EPR Standard"];
  let nodes: (string | JSX.Element)[] = [text];
  highlights.forEach((phrase) => {
    const next: (string | JSX.Element)[] = [];
    nodes.forEach((node) => {
      if (typeof node !== "string") return next.push(node);
      const parts = node.split(phrase);
      parts.forEach((p, i) => {
        if (p) next.push(p);
        if (i < parts.length - 1)
          next.push(
            <span key={`${phrase}-${i}`} className="text-foreground">
              {phrase}
            </span>,
          );
      });
    });
    nodes = next;
  });
  return nodes;
}

function SpotlightPortrait({ bw, color }: { bw: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const maskedRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);

  // target & current (damped) position of the reveal box, in % of the image
  const target = useRef({ x: 78, y: 80 }); // resting spot = bottom-right corner
  const current = useRef({ x: 78, y: 80 });
  const rest = { x: 78, y: 80 };
  const raf = useRef<number>(0);

  // square size as % of the image (width-based; height kept square via px)
  const SIZE = 30; // % of width

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const h = (SIZE / 2);
    // clamp so the box stays inside the image
    target.current = {
      x: Math.max(h, Math.min(100 - h, x)),
      y: Math.max(h, Math.min(100 - h, y)),
    };
  };

  useEffect(() => {
    const el = ref.current;
    const box = boxRef.current;
    const masked = maskedRef.current;
    if (!el) return;

    const tick = () => {
      // ease toward target (or rest position when not hovering)
      const t = active ? target.current : rest;
      current.current.x += (t.x - current.current.x) * 0.14;
      current.current.y += (t.y - current.current.y) * 0.14;

      const { x, y } = current.current;
      const wPx = (el.clientWidth * SIZE) / 100; // square side in px
      // position box (centered on x/y)
      if (box) {
        box.style.left = `${x}%`;
        box.style.top = `${y}%`;
        box.style.width = `${wPx}px`;
        box.style.height = `${wPx}px`;
      }
      // mask the color layer to exactly the same square
      if (masked) {
        masked.style.maskSize = `${wPx}px ${wPx}px`;
        masked.style.webkitMaskSize = `${wPx}px ${wPx}px`;
        const left = (x / 100) * el.clientWidth - wPx / 2;
        const top = (y / 100) * el.clientHeight - wPx / 2;
        masked.style.maskPosition = `${left}px ${top}px`;
        masked.style.webkitMaskPosition = `${left}px ${top}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  return (
    <div className="relative">
      {/* restored teal glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-lg blur-2xl" />

      <div
        ref={ref}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onMouseMove={onMove}
        className="relative overflow-hidden rounded-lg"
      >
        {/* Base: black & white, always */}
        <img
          src={bw}
          alt="Carlos Picardo"
          className="w-full aspect-[4/5] object-cover select-none"
          draggable={false}
        />
        {/* Color layer, revealed only inside the moving square */}
        <img
          ref={maskedRef}
          src={color}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
          style={{
            WebkitMaskImage: "linear-gradient(#000,#000)",
            maskImage: "linear-gradient(#000,#000)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        />
        {/* The existing blue/teal square — now the reveal window */}
        <div
          ref={boxRef}
          className="absolute pointer-events-none rounded-sm"
          style={{
            transform: "translate(-50%, -50%)",
            border: "1.5px solid color-mix(in srgb, var(--primary) 90%, transparent)",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.25), 0 0 24px color-mix(in srgb, var(--primary) 28%, transparent)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export function About() {
  const [expanded, setExpanded] = useState(false);
  const { data: c = ABOUT_DEFAULT } = useContent("about", ABOUT_DEFAULT);
  const f = useField(c);
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image column */}
          <AnimatedSection className="lg:col-span-5">
            <SpotlightPortrait bw={c.imageBw} color={c.imageColor} />
          </AnimatedSection>

          {/* Text column */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <p
                className="text-primary text-sm uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {c.eyebrow}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2
                className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.heading1}<br />
                <span className="text-primary">{c.heading2}</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p
                className="text-muted-foreground text-lg leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {f("intro")}
              </p>

              <div
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div
                    className="space-y-4 text-muted-foreground text-base leading-relaxed pb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <p>{richText(f("body1"))}</p>
                    <p>{richText(f("body2"))}</p>
                    <p>{richText(f("body3"))}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-primary hover:gap-3 transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {expanded ? "Show less" : "Read more"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </section>
  );
}
