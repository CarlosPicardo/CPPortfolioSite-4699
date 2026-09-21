import app from "./api";
import { db } from "./api/database";
import { siteContent } from "./api/database/schema";
import { eq } from "drizzle-orm";
import { SEO_DEFAULT, type SeoContent } from "./web/content/defaults";

const port = Number(process.env.PORT ?? 3000);
const distDir = `${import.meta.dir}/../dist`;
const indexPath = `${distDir}/index.html`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function getSeo(): Promise<SeoContent> {
  try {
    const row = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "seo"))
      .get();
    return { ...SEO_DEFAULT, ...((row?.value as SeoContent) ?? {}) };
  } catch {
    return SEO_DEFAULT;
  }
}

// Inject DB-driven SEO / Open Graph tags into the served HTML so shared links
// always show the latest title, description and image — editable from /admin.
async function renderIndex(html: string, origin: string): Promise<string> {
  const seo = await getSeo();
  const img = seo.image.startsWith("http") ? seo.image : `${origin}${seo.image}`;
  const url = seo.url || origin;
  const t = escapeHtml(seo.title);
  const d = escapeHtml(seo.description);
  const tags = `
    <meta name="description" content="${d}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${escapeHtml(img)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${escapeHtml(img)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />`;
  // strip the static SEO block we control, then re-inject fresh tags + title
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/g, "")
    .replace(/\s*<meta property="og:[^>]*>/g, "")
    .replace(/\s*<meta name="twitter:[^>]*>/g, "")
    .replace(/\s*<link rel="canonical"[^>]*>/g, "");
  out = out.replace("</head>", `${tags}\n</head>`);
  return out;
}

const server = Bun.serve({
  hostname: "0.0.0.0",
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return app.fetch(request);
    }

    const filePath = getStaticFilePath(url.pathname);
    const file = Bun.file(filePath);

    if (filePath !== indexPath && (await file.exists())) {
      return new Response(file);
    }

    const index = Bun.file(indexPath);
    if (await index.exists()) {
      const html = await index.text();
      const rendered = await renderIndex(html, url.origin);
      return new Response(rendered, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Build output not found. Run `bun run build` first.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
});

console.log(`Web server listening on http://localhost:${server.port}`);

function getStaticFilePath(pathname: string) {
  const cleanPath = decodeURIComponent(pathname)
    .replace(/^\/+/, "")
    .replaceAll("..", "");

  return cleanPath ? `${distDir}/${cleanPath}` : indexPath;
}
