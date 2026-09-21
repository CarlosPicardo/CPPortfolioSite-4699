// ---------------------------------------------------------------------------
// Custom Sections — the no-code page builder data model.
//
// Every section the user creates from /admin is one of these block TYPES, with
// its own `data` (the content) and `style` (per-section look & feel overrides).
// The public <CustomSection> renderer reads these and paints the block, fully
// on-brand by default but overridable down to fonts, colors, spacing & layout.
// ---------------------------------------------------------------------------

export type SectionType =
  | "text"
  | "image"
  | "gallery"
  | "video"
  | "list"
  | "cta"
  | "band"
  | "stats"
  | "quote";

// Per-section style overrides. Everything is optional — unset = inherit brand.
export interface SectionStyle {
  // colors
  bg?: string; // background color
  bgImage?: string; // optional background image url
  fg?: string; // main text color
  accent?: string; // accent (eyebrow, links, dividers)
  // typography
  font?: "display" | "body" | "mono"; // Clash Display / Satoshi / mono
  headingSize?: number; // rem-ish scale 1..8 (maps to clamp)
  align?: "left" | "center" | "right";
  // spacing / layout
  paddingY?: number; // vertical padding scale 1..8
  maxWidth?: "narrow" | "normal" | "wide" | "full";
  rounded?: boolean;
}

export interface CustomSection {
  id?: number;
  type: SectionType;
  data: Record<string, unknown>;
  style: SectionStyle;
  sort?: number;
  published?: boolean;
}

// ---- Block metadata for the admin picker ----
export interface BlockMeta {
  type: SectionType;
  label: string;
  icon: string; // emoji-free lucide name handled in admin
  desc: string;
  defaultData: Record<string, unknown>;
  defaultStyle: SectionStyle;
}

const BRAND_STYLE: SectionStyle = {
  font: "display",
  headingSize: 4,
  align: "left",
  paddingY: 5,
  maxWidth: "normal",
};

export const BLOCK_TYPES: BlockMeta[] = [
  {
    type: "text",
    label: "Text",
    icon: "Type",
    desc: "Eyebrow, heading and paragraphs.",
    defaultData: {
      eyebrow: "New Section",
      heading: "A bold headline goes here",
      body: "Write your story. This text block adapts to any length and uses your site's typography by default — change the font, size, colors and alignment from the Style panel.",
    },
    defaultStyle: { ...BRAND_STYLE },
  },
  {
    type: "image",
    label: "Image",
    icon: "Image",
    desc: "A single image with optional caption.",
    defaultData: {
      eyebrow: "",
      heading: "",
      image: "",
      caption: "",
      fit: "cover", // cover | contain
    },
    defaultStyle: { ...BRAND_STYLE, paddingY: 4, maxWidth: "wide", rounded: true },
  },
  {
    type: "gallery",
    label: "Gallery",
    icon: "LayoutGrid",
    desc: "A grid of images.",
    defaultData: {
      eyebrow: "Gallery",
      heading: "",
      images: [] as string[],
      columns: 3,
    },
    defaultStyle: { ...BRAND_STYLE, maxWidth: "wide" },
  },
  {
    type: "video",
    label: "Video / Embed",
    icon: "PlaySquare",
    desc: "YouTube, Spotify or any embed URL.",
    defaultData: {
      eyebrow: "",
      heading: "",
      url: "", // youtube/spotify/vimeo link or embed src
    },
    defaultStyle: { ...BRAND_STYLE, maxWidth: "normal" },
  },
  {
    type: "list",
    label: "List / Features",
    icon: "ListChecks",
    desc: "A list of items with titles and details.",
    defaultData: {
      eyebrow: "",
      heading: "What I offer",
      // one per line: "Title | detail"
      items: "Production | Full-track production across genres\nEngineering | Recording, mixing & mastering\nSongwriting | Topline, lyrics and arrangement",
      columns: 2,
    },
    defaultStyle: { ...BRAND_STYLE },
  },
  {
    type: "cta",
    label: "Call to action",
    icon: "MousePointerClick",
    desc: "A heading with one or two buttons.",
    defaultData: {
      eyebrow: "",
      heading: "Let's make something",
      body: "",
      button1Label: "Get in touch",
      button1Url: "mailto:c.picardo27@gmail.com",
      button2Label: "",
      button2Url: "",
    },
    defaultStyle: { ...BRAND_STYLE, align: "center", paddingY: 6 },
  },
  {
    type: "band",
    label: "Feature band",
    icon: "PanelTop",
    desc: "A full-bleed cinematic band (EPR-style).",
    defaultData: {
      eyebrow: "Featured",
      heading: "A new venture",
      body: "A full-width statement band for highlighting something important — a company, an award, a milestone.",
      tagline: "",
      buttonLabel: "Learn more",
      buttonUrl: "",
      image: "",
    },
    defaultStyle: {
      bg: "#0d0a08",
      fg: "#f2ede4",
      accent: "#c4986a",
      font: "display",
      headingSize: 6,
      align: "center",
      paddingY: 7,
      maxWidth: "normal",
    },
  },
  {
    type: "stats",
    label: "Stats / Numbers",
    icon: "Hash",
    desc: "Big numbers with labels.",
    defaultData: {
      eyebrow: "",
      heading: "",
      // one per line: "Number | label"
      items: "50+ | Tracks produced\n3 | Studios worked in\n5 | Pro certifications",
    },
    defaultStyle: { ...BRAND_STYLE, align: "center" },
  },
  {
    type: "quote",
    label: "Quote",
    icon: "Quote",
    desc: "A large pull-quote with attribution.",
    defaultData: {
      quote: "Break the f-ing box.",
      author: "Carlos Picardo",
    },
    defaultStyle: { ...BRAND_STYLE, align: "center", headingSize: 5, paddingY: 6 },
  },
];

export function blockMeta(type: SectionType): BlockMeta {
  return BLOCK_TYPES.find((b) => b.type === type) ?? BLOCK_TYPES[0];
}

// ---- Style → CSS helpers (shared by renderer + admin preview) ----

const SIZE_SCALE: Record<number, string> = {
  1: "clamp(1.1rem, 3vw, 1.4rem)",
  2: "clamp(1.4rem, 4vw, 1.9rem)",
  3: "clamp(1.8rem, 5vw, 2.6rem)",
  4: "clamp(2.2rem, 6vw, 3.4rem)",
  5: "clamp(2.8rem, 7vw, 4.2rem)",
  6: "clamp(3.4rem, 9vw, 5.4rem)",
  7: "clamp(4rem, 11vw, 7rem)",
  8: "clamp(5rem, 14vw, 9rem)",
};

const PAD_SCALE: Record<number, string> = {
  1: "2rem",
  2: "3rem",
  3: "4rem",
  4: "5rem",
  5: "6rem",
  6: "8rem",
  7: "10rem",
  8: "13rem",
};

const WIDTH_SCALE: Record<string, string> = {
  narrow: "44rem",
  normal: "64rem",
  wide: "80rem",
  full: "100%",
};

const FONT_STACK: Record<string, string> = {
  display: "var(--font-display, 'Clash Display', sans-serif)",
  body: "var(--font-body, 'Satoshi', sans-serif)",
  mono: "'Space Mono', ui-monospace, monospace",
};

export function headingFontSize(style: SectionStyle): string {
  return SIZE_SCALE[style.headingSize ?? 4] ?? SIZE_SCALE[4];
}
export function sectionPaddingY(style: SectionStyle): string {
  return PAD_SCALE[style.paddingY ?? 5] ?? PAD_SCALE[5];
}
export function sectionMaxWidth(style: SectionStyle): string {
  return WIDTH_SCALE[style.maxWidth ?? "normal"];
}
export function fontFamily(style: SectionStyle): string {
  return FONT_STACK[style.font ?? "display"];
}

// Curated brand-safe color swatches offered in the admin color pickers.
export const SWATCHES = {
  bg: ["#0A0A0A", "#111111", "#0d0a08", "#1a1310", "#f2ede4", "#ffffff", "transparent"],
  fg: ["#FFFFFF", "#E8E8E8", "#0A0A0A", "#f2ede4", "#1a1310"],
  accent: ["#00D4AA", "#FF2D2D", "#c4986a", "#9a6b43", "#FFFFFF", "#888888"],
};
