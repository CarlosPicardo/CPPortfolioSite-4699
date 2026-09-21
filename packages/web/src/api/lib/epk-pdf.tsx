import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Font,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../assets/fonts");

let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "Clash Display",
    fonts: [
      { src: path.join(FONT_DIR, "ClashDisplay-400.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "ClashDisplay-500.ttf"), fontWeight: 500 },
      { src: path.join(FONT_DIR, "ClashDisplay-600.ttf"), fontWeight: 600 },
    ],
  });
  Font.register({
    family: "Satoshi",
    fonts: [
      { src: path.join(FONT_DIR, "Manrope-400.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "Manrope-500.ttf"), fontWeight: 500 },
      { src: path.join(FONT_DIR, "Manrope-700.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Space Mono",
    fonts: [
      { src: path.join(FONT_DIR, "SpaceMono-400.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "SpaceMono-700.ttf"), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]); // no auto-hyphenation
  fontsRegistered = true;
}

const CREAM = "#F2EDE4";
const INK = "#1A1310";
const ESPRESSO = "#0D0A08";
const COPPER = "#9A6B43";
const BRONZE = "#C4986A";
const MUTED = "#6B5D4F";
const LINE = "#D4CEC6"; // solid equivalent of rgba(26,19,16,0.14) over cream — react-pdf mis-renders rgba() borders

const s = StyleSheet.create({
  page: { fontFamily: "Satoshi", backgroundColor: CREAM, color: INK },

  // ---- COVER ----
  cover: { position: "relative", backgroundColor: ESPRESSO },
  coverImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  coverContent: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  coverTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  kicker: { fontFamily: "Space Mono", fontSize: 9, letterSpacing: 3, color: BRONZE, textTransform: "uppercase" },
  eprMark: { fontFamily: "Space Mono", fontSize: 7.5, letterSpacing: 1.5, color: CREAM, textTransform: "uppercase", borderWidth: 1, borderColor: "#746F6B", borderRadius: 3, paddingVertical: 6, paddingHorizontal: 9, textAlign: "center", lineHeight: 1.5 },
  coverName: { fontFamily: "Clash Display", fontWeight: 600, fontSize: 64, lineHeight: 0.98, letterSpacing: -1, color: CREAM },
  coverRole: { fontFamily: "Space Mono", fontSize: 11, letterSpacing: 2.4, textTransform: "uppercase", color: "rgba(242,237,228,0.75)", marginTop: 14 },
  coverRule: { width: 46, height: 2, backgroundColor: COPPER, marginTop: 20, marginBottom: 20 },
  coverQuote: { fontFamily: "Clash Display", fontWeight: 500, fontSize: 15, lineHeight: 1.35, color: "rgba(242,237,228,0.92)", maxWidth: 320 },
  coverFoot: { fontFamily: "Space Mono", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(242,237,228,0.55)" },

  // ---- CONTENT PAGES ----
  contentPage: { padding: "26mm 20mm 20mm", display: "flex", flexDirection: "column" },
  indexRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  indexNum: { fontFamily: "Space Mono", fontSize: 10, color: COPPER },
  h2: { fontFamily: "Space Mono", fontSize: 10, letterSpacing: 2.6, textTransform: "uppercase", color: COPPER },
  lead: { fontFamily: "Clash Display", fontWeight: 500, fontSize: 17, lineHeight: 1.4, letterSpacing: -0.2, color: INK, marginBottom: 12 },
  body: { fontSize: 10, lineHeight: 1.6, color: "#3A2F27", marginBottom: 8 },
  section: { marginBottom: 22 },

  eprBand: { backgroundColor: ESPRESSO, borderRadius: 8, padding: 22 },
  eprBandLead: { fontFamily: "Clash Display", fontWeight: 500, fontSize: 16, color: CREAM, marginBottom: 8 },
  eprBandBody: { fontSize: 10, lineHeight: 1.6, color: "#CDBFB0", marginBottom: 8 },
  eprLink: { fontFamily: "Space Mono", fontSize: 9.5, letterSpacing: 0.5, color: BRONZE },

  expHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 },
  expTitle: { fontFamily: "Clash Display", fontWeight: 600, fontSize: 14 },
  expLoc: { fontFamily: "Space Mono", fontSize: 8.5, color: MUTED, letterSpacing: 0.5, textTransform: "uppercase" },
  bullet: { flexDirection: "row", fontSize: 9.5, color: "#3A2F27", marginBottom: 4, paddingLeft: 2 },
  bulletDash: { color: COPPER, width: 14 },

  tags: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  tag: { borderWidth: 1, borderColor: LINE, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11, fontSize: 9, color: INK },

  creditsGrid: { flexDirection: "row", flexWrap: "wrap" },
  creditItem: { width: "50%", paddingRight: 16, marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: LINE },
  creditTitle: { fontFamily: "Clash Display", fontWeight: 600, fontSize: 10.5, color: INK, marginBottom: 2 },
  creditRoles: { fontSize: 8, color: MUTED, letterSpacing: 0.2 },

  footerContact: { flexDirection: "row", gap: 16, marginTop: "auto", paddingTop: 14, borderTopWidth: 1, borderTopColor: LINE },
  footerContactText: { fontFamily: "Space Mono", fontSize: 8.5, letterSpacing: 0.5, color: MUTED },

  runningFooter: { position: "absolute", bottom: 14, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" },
  runningFooterText: { fontFamily: "Space Mono", fontSize: 7.5, letterSpacing: 1.5, textTransform: "uppercase", color: MUTED },
});

interface EpkData {
  about: Record<string, string>;
  epr: Record<string, string>;
  exp: Record<string, string>;
  certItems: string[];
  expBullets: string[];
  credits: { title: string; roles: string }[];
  eprLink: string;
  email: string;
  instagram: string;
  year: number;
  portraitPath: string;
}

function RunningFooter({ page }: { page: string }) {
  return (
    <View style={s.runningFooter} fixed>
      <Text style={s.runningFooterText}>Carlos Picardo — Press Kit</Text>
      <Text style={s.runningFooterText}>{page}</Text>
    </View>
  );
}

function EpkDocument(d: EpkData) {
  return (
    <Document
      title="Carlos Picardo — Press Kit"
      author="Carlos Picardo"
      subject="Electronic Press Kit"
    >
      {/* PAGE 1 — COVER */}
      <Page size="A4" style={[s.page, s.cover]}>
        <View style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={d.portraitPath} style={s.coverImg} />
          <Svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <Defs>
              <LinearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={ESPRESSO} stopOpacity={0.15} />
                <Stop offset="0.48" stopColor={ESPRESSO} stopOpacity={0.25} />
                <Stop offset="0.72" stopColor={ESPRESSO} stopOpacity={0.75} />
                <Stop offset="1" stopColor={ESPRESSO} stopOpacity={0.97} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#scrim)" />
          </Svg>
          <View style={s.coverContent}>
            <View style={s.coverTop}>
              <Text style={s.kicker}>Carlos Picardo · Press Kit</Text>
              <Text style={s.eprMark}>EPR{"\n"}STANDARD</Text>
            </View>
            <View>
              <Text style={s.coverName}>Carlos{"\n"}Picardo</Text>
              <Text style={s.coverRole}>Producer · Engineer · Artist</Text>
              <View style={s.coverRule} />
              <Text style={s.coverQuote}>
                {d.epr.tagline || "Authors of Sound"} — building the infrastructure to recognise
                everyone who shapes the sound of a record.
              </Text>
              <View style={{ height: 22 }} />
              <Text style={s.coverFoot}>Founder &amp; CEO — EPR Standard · {d.year}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2 — BIOGRAPHY / EPR / EXPERIENCE */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <View style={s.section}>
          <View style={s.indexRow}>
            <Text style={s.indexNum}>01</Text>
            <Text style={s.h2}>Biography</Text>
          </View>
          <Text style={s.lead}>{d.about.intro || ""}</Text>
          {[d.about.body1, d.about.body2, d.about.body3].filter(Boolean).map((b, i) => (
            <Text key={i} style={s.body}>{b}</Text>
          ))}
        </View>

        <View style={[s.section, s.eprBand]}>
          <View style={s.indexRow}>
            <Text style={[s.indexNum, { color: BRONZE }]}>02</Text>
            <Text style={[s.h2, { color: BRONZE }]}>{d.epr.title || "EPR Standard"}</Text>
          </View>
          <Text style={s.eprBandLead}>{d.epr.tagline || "Authors of Sound"}</Text>
          <Text style={s.eprBandBody}>{d.epr.body || ""}</Text>
          <Text style={s.eprLink}>{d.eprLink.replace(/^https?:\/\//, "")}</Text>
        </View>

        <View style={s.section}>
          <View style={s.indexRow}>
            <Text style={s.indexNum}>03</Text>
            <Text style={s.h2}>Experience — {d.exp.studio || "Sonic Live Studios"}</Text>
          </View>
          <View style={s.expHead}>
            <Text style={s.expTitle}>{d.exp.heading || "Studio Assistant"}</Text>
            <Text style={s.expLoc}>{d.exp.location || ""}</Text>
          </View>
          <Text style={s.body}>{d.exp.body || ""}</Text>
          {d.expBullets.map((b, i) => (
            <View key={i} style={s.bullet}>
              <Text style={s.bulletDash}>—</Text>
              <Text style={{ flex: 1 }}>{b}</Text>
            </View>
          ))}
        </View>
        <RunningFooter page="02 / 03" />
      </Page>

      {/* PAGE 3 — CERTIFICATIONS / CREDITS */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <View style={s.section}>
          <View style={s.indexRow}>
            <Text style={s.indexNum}>04</Text>
            <Text style={s.h2}>Certifications</Text>
          </View>
          <View style={s.tags}>
            {d.certItems.map((item, i) => (
              <Text key={i} style={s.tag}>{item.replace(/\s*\|\s*/g, " · ")}</Text>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <View style={s.indexRow}>
            <Text style={s.indexNum}>05</Text>
            <Text style={s.h2}>Selected Credits</Text>
          </View>
          <View style={s.creditsGrid}>
            {d.credits.map((c, i) => (
              <View key={i} style={s.creditItem}>
                <Text style={s.creditTitle}>{c.title}</Text>
                <Text style={s.creditRoles}>{c.roles}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.footerContact}>
          <Text style={s.footerContactText}>{d.email}</Text>
          <Text style={s.footerContactText}>{d.instagram}</Text>
          <Text style={s.footerContactText}>carlospicardo.com</Text>
        </View>
        <RunningFooter page="03 / 03" />
      </Page>
    </Document>
  );
}

export async function renderEpkPdf(data: EpkData): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(EpkDocument(data));
}
