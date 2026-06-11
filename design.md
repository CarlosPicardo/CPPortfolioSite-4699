# Design Direction — Carlos Picardo Portfolio

## Vibe
Dark, bold, cinematic. Music producer aesthetic — think studio monitors, neon accents on dark backgrounds, dramatic typography. Not generic tech portfolio.

## Typography
- Display: **Clash Display** (via CDN or fallback to system sans-serif bold)
- Body: **Satoshi** (clean geometric sans)
- Fallback: system-ui, -apple-system, sans-serif
- Hierarchy: Display at 5rem+ for hero, body at 1rem-1.125rem

## Colors
- Background: #0A0A0A (near-black)
- Foreground: #F5F5F5 (off-white)
- Accent: #00D4AA (teal/cyan — ties to Spotify embed and studio aesthetic)
- Accent secondary: #1DB954 (Spotify green for music links)
- Muted: #1A1A1A (cards, sections)
- Muted text: #888888
- Border: rgba(255,255,255,0.08)

## Layout
- Single-page vertical scroll
- Full-width hero with parallax background
- Generous whitespace between sections (120px+)
- Max content width: 1200px centered
- Asymmetric layouts where possible (text left, visual right)

## Motion
- Staggered fade-in on scroll (IntersectionObserver based)
- Smooth scroll between nav anchors
- Hover lifts on cards
- Gradient text shimmer on hero name
- Scroll progress indicator in nav
- CSS transitions preferred; no heavy JS animation libs

## Sections (in order)
1. **Hero** — Full-screen, bg image, name + tagline + CTA
2. **About** — Bio text with profile image
3. **Aqueo Records** — Featured project showcase
4. **Experience** — Studio Assistant at Sonic Live Studios, Vienna
5. **Certifications** — Grid of certs (Avid, Midas, Ableton, Steinberg, DigiCo)
6. **Connect** — Social links (Spotify, Instagram, YouTube, TikTok)
