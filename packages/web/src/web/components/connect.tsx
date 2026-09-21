import { useState } from "react";
import { AnimatedSection } from "./animated-section";
import { useContent } from "../lib/content";
import { SOCIALS_DEFAULT, CONTACT_DEFAULT } from "../content/defaults";
import { useI18n, useField } from "../lib/i18n";

const socials = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/4Opx9PV9kDvPTsNAsFERdW",
    color: "#1DB954",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.081 20.04 8.94c.6.36.78 1.02.42 1.56-.36.48-1.08.72-1.56.36z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/carlos.picardo/",
    color: "#E4405F",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@carlos.picardo",
    color: "#FF0000",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@carlospicardo",
    color: "#00F2EA",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

function ContactForm() {
  const { t } = useI18n();
  const { data: cc = CONTACT_DEFAULT } = useContent("contact", CONTACT_DEFAULT);
  const f = useField(cc);
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", body: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  const inp =
    "w-full bg-foreground/[0.04] border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors";

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-xl text-left" style={{ fontFamily: "var(--font-body)" }}>
      <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3 text-center">{cc.eyebrow}</p>
      <h3 className="text-3xl md:text-4xl font-bold mb-3 text-center" style={{ fontFamily: "var(--font-display)" }}>
        {cc.heading}
      </h3>
      <p className="text-muted-foreground text-sm text-center mb-8 max-w-md mx-auto">{f("body")}</p>
      {status === "sent" ? (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 text-center text-foreground">
          {t("contact.sent")}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className={inp} placeholder={t("contact.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className={inp} type="email" placeholder={t("contact.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <input className={inp} placeholder={t("contact.subject")} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea className={inp + " min-h-[120px] resize-y"} placeholder={t("contact.message")} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          {/* honeypot — hidden from humans, bots fill it */}
          <input
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "sending" ? t("contact.sending") : cc.buttonLabel || t("contact.send")}
          </button>
          {status === "error" && <p className="text-red-400 text-xs text-center">{t("contact.error")}</p>}
        </div>
      )}
    </form>
  );
}

export function Connect() {
  const { t } = useI18n();
  const epkLabel = t("epk.download");
  const { data: c = SOCIALS_DEFAULT } = useContent("socials", SOCIALS_DEFAULT);
  const fc = useField(c);
  const resolved = socials.map((s) => {
    const key = s.name.toLowerCase() as keyof typeof SOCIALS_DEFAULT;
    const url = c[key];
    return url ? { ...s, url } : s;
  });
  return (
    <section id="connect" className="py-20 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimatedSection>
          <p
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Let's Connect
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find me on
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p
            className="text-muted-foreground text-lg text-center max-w-xl mx-auto mb-16"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {fc("connectIntro")}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {resolved.map((s, i) => (
            <AnimatedSection key={s.name} delay={0.15 * (i + 1)}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-4 group hover:border-foreground/20 transition-all duration-500"
              >
                <div
                  className="transition-all duration-500 text-muted-foreground group-hover:scale-110"
                  style={{ color: undefined }}
                >
                  <div className="group-hover:hidden">{s.icon}</div>
                  <div className="hidden group-hover:block" style={{ color: s.color }}>
                    {s.icon}
                  </div>
                </div>
                <span
                  className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.name}
                </span>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.25}>
          <div className="mt-14 flex justify-center">
            <a
              href="/api/epk"
              download="Carlos-Picardo-Press-Kit.pdf"
              className="group inline-flex items-center gap-3 rounded-full border border-border bg-foreground/[0.03] px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-500 hover:border-primary/60 hover:bg-primary/5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-primary transition-transform duration-500 group-hover:translate-y-0.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="uppercase tracking-[0.18em]">{epkLabel}</span>
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <ContactForm />
        </AnimatedSection>

      </div>
    </section>
  );
}
