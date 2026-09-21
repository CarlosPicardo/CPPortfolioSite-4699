import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

// Fixed UI strings (labels, buttons) — content text comes from the CMS.
const DICT: Record<string, { en: string; es: string }> = {
  "nav.work": { en: "Work", es: "Trabajo" },
  "nav.about": { en: "About", es: "Sobre mí" },
  "nav.music": { en: "Music", es: "Música" },
  "nav.epr": { en: "EPR Standard", es: "EPR Standard" },
  "nav.experience": { en: "Experience", es: "Experiencia" },
  "nav.connect": { en: "Connect", es: "Contacto" },
  "common.readMore": { en: "Read more", es: "Leer más" },
  "common.readLess": { en: "Read less", es: "Leer menos" },
  "common.seeAll": { en: "See all", es: "Ver todo" },
  "common.listen": { en: "Listen", es: "Escuchar" },
  "common.close": { en: "Close", es: "Cerrar" },
  "common.more": { en: "more", es: "más" },
  "contact.name": { en: "Your name", es: "Tu nombre" },
  "contact.email": { en: "Your email", es: "Tu email" },
  "contact.subject": { en: "Subject", es: "Asunto" },
  "contact.message": { en: "Message", es: "Mensaje" },
  "contact.send": { en: "Send message", es: "Enviar mensaje" },
  "contact.sending": { en: "Sending…", es: "Enviando…" },
  "contact.sent": { en: "Message sent — thank you!", es: "Mensaje enviado — ¡gracias!" },
  "contact.error": { en: "Something went wrong. Try again.", es: "Algo falló. Inténtalo de nuevo." },
  "epk.download": { en: "Download press kit", es: "Descargar press kit" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("epr_lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
    else if (typeof navigator !== "undefined" && navigator.language?.startsWith("es")) setLangState("es");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("epr_lang", l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: string) => DICT[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

/**
 * Pick a localized field from a CMS object. Spanish overrides live in a
 * sibling `<field>_es` key; if empty we fall back to the English/base value.
 */
export function useField<T extends Record<string, unknown>>(obj: T) {
  const { lang } = useI18n();
  return (key: keyof T & string): string => {
    const base = (obj?.[key] as string) ?? "";
    if (lang === "es") {
      const es = (obj as Record<string, unknown>)[`${key}_es`] as string | undefined;
      return es && es.trim() ? es : base;
    }
    return base;
  };
}
