import type { CSSProperties } from "react";
import type { CustomSection as Section, SectionStyle } from "../content/sections";
import {
  headingFontSize,
  sectionPaddingY,
  sectionMaxWidth,
  fontFamily,
} from "../content/sections";
import { CoverImage } from "./cover-image";

function mediaUrl(u: string): string {
  if (!u) return "";
  if (u.startsWith("http") || u.startsWith("/")) return u;
  return `/api/media/${encodeURIComponent(u)}`;
}

function embedUrl(url: string): string {
  if (!url) return "";
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Spotify
  const sp = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([\w]+)/);
  if (sp) return `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`;
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url; // assume already an embed src
}

function wrapStyle(style: SectionStyle): CSSProperties {
  const s: CSSProperties = {
    paddingTop: sectionPaddingY(style),
    paddingBottom: sectionPaddingY(style),
    textAlign: style.align ?? "left",
  };
  if (style.bg && style.bg !== "transparent") s.background = style.bg;
  if (style.bgImage) {
    s.backgroundImage = `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url(${mediaUrl(style.bgImage)})`;
    s.backgroundSize = "cover";
    s.backgroundPosition = "center";
  }
  if (style.fg) s.color = style.fg;
  return s;
}

function innerStyle(style: SectionStyle): CSSProperties {
  const align = style.align ?? "left";
  return {
    maxWidth: sectionMaxWidth(style),
    marginLeft: align === "left" ? "0" : "auto",
    marginRight: align === "right" ? "0" : "auto",
    width: "100%",
  };
}

function Eyebrow({ text, style }: { text?: string; style: SectionStyle }) {
  if (!text) return null;
  return (
    <p
      className="mb-4 text-xs font-semibold uppercase tracking-[0.25em]"
      style={{ color: style.accent ?? "#00D4AA", fontFamily: "'Space Mono', monospace" }}
    >
      {text}
    </p>
  );
}

function Heading({ text, style }: { text?: string; style: SectionStyle }) {
  if (!text) return null;
  return (
    <h2
      className="font-bold leading-[1.05]"
      style={{ fontSize: headingFontSize(style), fontFamily: fontFamily(style) }}
    >
      {text}
    </h2>
  );
}

export function CustomSection({ section }: { section: Section }) {
  const { type, style } = section;
  const d = section.data as Record<string, string>;
  const accent = style.accent ?? "#00D4AA";

  return (
    <section
      style={wrapStyle(style)}
      className="relative w-full overflow-hidden px-6"
      data-custom-section
    >
      <div style={innerStyle(style)}>
        {type === "text" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            {d.body && (
              <div className="mt-6 space-y-4 text-base leading-relaxed opacity-80 md:text-lg">
                {d.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i} style={{ fontFamily: fontFamily({ ...style, font: "body" }) }}>
                    {p}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {type === "image" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            {d.image && (
              <CoverImage
                src={mediaUrl(d.image)}
                alt={d.caption || d.heading || ""}
                className={`mt-6 w-full ${style.rounded ? "rounded-2xl" : ""}`}
                style={{
                  objectFit: (d.fit as "cover" | "contain") || "cover",
                  maxHeight: "70vh",
                }}
              />
            )}
            {d.caption && (
              <p className="mt-3 text-sm opacity-60" style={{ fontFamily: "'Space Mono', monospace" }}>
                {d.caption}
              </p>
            )}
          </>
        )}

        {type === "gallery" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            <div
              className="mt-6 grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${Math.min(Number((section.data as { columns?: number }).columns) || 3, 4)}, minmax(0,1fr))`,
              }}
            >
              {((section.data.images as string[]) || []).map((img, i) => (
                <CoverImage
                  key={i}
                  src={mediaUrl(img)}
                  alt=""
                  className={`aspect-square w-full object-cover ${style.rounded ? "rounded-xl" : "rounded-md"}`}
                />
              ))}
            </div>
          </>
        )}

        {type === "video" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            {d.url && (
              <div className={`mt-6 overflow-hidden ${style.rounded ? "rounded-2xl" : "rounded-lg"}`}>
                <iframe
                  src={embedUrl(d.url)}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={d.heading || "embed"}
                />
              </div>
            )}
          </>
        )}

        {type === "list" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            <div
              className="mt-8 grid gap-6 text-left"
              style={{
                gridTemplateColumns: `repeat(${Math.min(Number((section.data as { columns?: number }).columns) || 2, 3)}, minmax(0,1fr))`,
              }}
            >
              {(d.items || "").split("\n").filter(Boolean).map((line, i) => {
                const [t, det] = line.split("|").map((x) => x.trim());
                return (
                  <div key={i} className="border-t pt-4" style={{ borderColor: accent + "44" }}>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: fontFamily(style) }}>
                      {t}
                    </h3>
                    {det && <p className="mt-1 text-sm opacity-70">{det}</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {type === "stats" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            <div className="mt-8 flex flex-wrap justify-center gap-10 md:gap-16">
              {(d.items || "").split("\n").filter(Boolean).map((line, i) => {
                const [num, label] = line.split("|").map((x) => x.trim());
                return (
                  <div key={i}>
                    <div
                      className="font-bold leading-none"
                      style={{ fontSize: headingFontSize(style), color: accent, fontFamily: fontFamily(style) }}
                    >
                      {num}
                    </div>
                    {label && <div className="mt-2 text-sm uppercase tracking-wider opacity-70">{label}</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {type === "quote" && (
          <blockquote className="mx-auto max-w-3xl">
            <p
              className="font-bold leading-tight"
              style={{ fontSize: headingFontSize(style), fontFamily: fontFamily(style) }}
            >
              “{d.quote}”
            </p>
            {d.author && (
              <footer className="mt-6 text-sm uppercase tracking-[0.25em]" style={{ color: accent, fontFamily: "'Space Mono', monospace" }}>
                — {d.author}
              </footer>
            )}
          </blockquote>
        )}

        {type === "cta" && (
          <>
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            {d.body && <p className="mx-auto mt-5 max-w-xl text-base opacity-80 md:text-lg">{d.body}</p>}
            <div className={`mt-8 flex flex-wrap gap-4 ${style.align === "center" ? "justify-center" : style.align === "right" ? "justify-end" : ""}`}>
              {d.button1Label && (
                <a
                  href={d.button1Url || "#"}
                  className="rounded-full px-7 py-3 text-sm font-semibold transition hover:opacity-90"
                  style={{ background: accent, color: "#0A0A0A" }}
                >
                  {d.button1Label}
                </a>
              )}
              {d.button2Label && (
                <a
                  href={d.button2Url || "#"}
                  className="rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-white/10"
                  style={{ borderColor: (style.fg ?? "#fff") + "55" }}
                >
                  {d.button2Label}
                </a>
              )}
            </div>
          </>
        )}

        {type === "band" && (
          <div className="mx-auto max-w-3xl">
            <Eyebrow text={d.eyebrow} style={style} />
            <Heading text={d.heading} style={style} />
            {d.body && <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed opacity-85 md:text-lg">{d.body}</p>}
            {d.tagline && (
              <p className="mt-8 text-lg italic md:text-2xl" style={{ color: accent }}>
                {d.tagline}
              </p>
            )}
            {d.buttonLabel && (
              <div className="mt-8">
                <a
                  href={d.buttonUrl || "#"}
                  className="inline-block rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-90"
                  style={{ background: accent, color: "#0A0A0A" }}
                >
                  {d.buttonLabel}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
