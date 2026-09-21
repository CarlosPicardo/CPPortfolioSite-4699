// Single source of truth for ALL editable site text.
// These are the real, currently-visible copy values. The admin pre-fills
// every field from here, the API seeds them into the DB on first run, and the
// public components read them via useContent(key, DEFAULTS[key]).
//
// Edit on the site → saved to DB → overrides these. If the DB has nothing,
// the component falls back to these exact values, so nothing ever looks empty.

export interface HeroContent {
  eyebrow: string;
  image: string;
}

export interface AboutContent {
  eyebrow: string;
  heading1: string;
  heading2: string;
  intro: string;
  body1: string;
  body2: string;
  body3: string;
  imageBw: string;
  imageColor: string;
}

export interface ExperienceItem {
  studio: string;
  location: string;
  body: string;
  bullets: string;
  image: string;
}

export interface ExperienceContent {
  eyebrow: string;
  heading: string;
  studio: string;
  location: string;
  body: string;
  bullets: string; // one per line
  image: string;
}

export interface CertContent {
  eyebrow: string;
  heading: string;
  items: string; // one per line: "Name | detail"
}

export interface EprContent {
  eyebrow: string;
  title: string;
  body: string;
  tagline: string;
  link: string;
}

export interface SocialsContent {
  spotify: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  email: string;
  connectIntro: string;
}

export interface ListenContent {
  eyebrow: string;
  heading: string;
  body: string;
}

export interface MusicContent {
  eyebrow: string;
  heading: string;
  body: string;
}

export const HERO_DEFAULT: HeroContent = {
  eyebrow: "Producer, Engineer, Artist",
  image: "/images/hero-bg.jpg",
};

export const ABOUT_DEFAULT: AboutContent = {
  eyebrow: "About Me",
  heading1: "Crafting sound",
  heading2: "with intention",
  intro:
    "I'm a young music producer with hands-on experience in professional studios and a strong artistic background. My approach combines technical precision with emotional understanding, shaped by my early years as a singer-songwriter.",
  body1:
    "I work across production, recording, mixing and mastering — moving between modern pop, alternative rock, folk and urban sounds. What ties it all together is a belief that the technical craft only matters when it serves the emotion of the song.",
  body2:
    "I spent three months at Sonic Live Studios in Vienna as a Studio Assistant through an Erasmus+ scholarship, working in a state-of-the-art facility alongside artists, producers and creative teams. I assisted in recording sessions, music production and video shoots, while managing the studio's social presence — sharpening my communication, adaptability and ability to stay organised under pressure.",
  body3:
    "Today my focus extends beyond the console: through EPR Standard, I'm building the infrastructure to recognise everyone who shapes the sound of a record — not just who wrote the song.",
  imageBw: "/images/profile-bw.jpg",
  imageColor: "/images/profile-color.jpg",
};

export const EXPERIENCE_DEFAULT: ExperienceContent = {
  eyebrow: "Experience",
  heading: "Studio Assistant",
  studio: "Sonic Live Studios",
  location: "Vienna, Austria · Erasmus+ Scholarship",
  body:
    "Spent three months working in a state-of-the-art recording facility as part of an Erasmus+ scholarship. Gained hands-on experience with high-end studio equipment and learned to work with a wide range of artists, producers, and creative teams.",
  bullets:
    "Assisted in recording sessions, music production, and video shoots\nManaged social media accounts to promote studio projects\nWorked with a wide range of artists, producers, and creative teams\nStrengthened communication skills and adaptability under pressure",
  image: "/images/studio.jpg",
};

export const CERTS_DEFAULT: CertContent = {
  eyebrow: "Credentials",
  heading: "Certifications",
  items:
    "AVID Pro Tools | (110) Specialist Certified\nMIDAS | Pro Series Operator\nAbleton | Certified\nSteinberg | Certified\nDigiCo | Certified",
};

export const EPR_DEFAULT: EprContent = {
  eyebrow: "Founder & CEO",
  title: "EPR Standard",
  body:
    "EPR Standard — short for Engineering & Producing Rights — is a framework for recognising the people who shape the sound of recorded music. Not just who wrote the song, but who engineered, produced and crafted the final record.",
  tagline: "Authors of Sound",
  link: "https://eprstandard.com",
};

export const SOCIALS_DEFAULT: SocialsContent = {
  spotify: "https://open.spotify.com/artist/4Opx9PV9kDvPTsNAsFERdW",
  instagram: "https://www.instagram.com/carlos.picardo/",
  youtube: "https://www.youtube.com/@carlos.picardo",
  tiktok: "https://www.tiktok.com/@carlospicardo",
  email: "c.picardo27@gmail.com",
  connectIntro:
    "Follow my journey as a music producer and stay up to date with new releases, studio sessions, and creative projects.",
};

export const LISTEN_DEFAULT: ListenContent = {
  eyebrow: "Listen",
  heading: "The work, in your ears",
  body:
    "Two sides of the same craft — the productions and engineering work I've shaped for others, and my own music as an artist.",
};

export const MUSIC_DEFAULT: MusicContent = {
  eyebrow: "Selected Works",
  heading: "Discography",
  body:
    "A selection of songs and collaborations I've produced, recorded, and mixed. Click any project to listen.",
};

export interface SeoContent {
  title: string;
  description: string;
  image: string; // og/twitter image url
  url: string; // canonical site url
}

export const SEO_DEFAULT: SeoContent = {
  title: "Carlos Picardo — Music Producer & Engineer",
  description:
    "Producer · Engineer · Artist. Shaping sound. Owning the credit. Founder of EPR Standard.",
  image: "/images/og-image.png",
  url: "https://carlospicardo.com",
};

export interface ContactContent {
  eyebrow: string;
  heading: string;
  body: string;
  buttonLabel: string;
}

export const CONTACT_DEFAULT: ContactContent = {
  eyebrow: "Get in touch",
  heading: "Let's make something",
  body: "Have a project, a session, or a question about EPR Standard? Drop me a line — I read everything.",
  buttonLabel: "Send message",
};

// Registry used by the API seeder and the admin to map keys → defaults.
export const CONTENT_DEFAULTS: Record<string, unknown> = {
  hero: HERO_DEFAULT,
  about: ABOUT_DEFAULT,
  experience: EXPERIENCE_DEFAULT,
  certifications: CERTS_DEFAULT,
  epr: EPR_DEFAULT,
  socials: SOCIALS_DEFAULT,
  listen: LISTEN_DEFAULT,
  music: MUSIC_DEFAULT,
  seo: SEO_DEFAULT,
  contact: CONTACT_DEFAULT,
};
