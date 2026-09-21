import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, asc } from "drizzle-orm";
import { db } from "./database";
import { songs, siteContent, customSections, messages } from "./database/schema";
import { desc as descOrder } from "drizzle-orm";
import { makeToken, verifyToken, DEFAULT_ADMIN_PASSWORD, randomKey } from "./lib/auth";
import { putObject, getObject } from "./lib/s3";
import { sendEmail } from "./lib/email";
import { renderEpkPdf } from "./lib/epk-pdf";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { musicProjects } from "../web/content/projects";
import { CONTENT_DEFAULTS } from "../web/content/defaults";

// ---- helpers ----
function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const row = await db.select().from(siteContent).where(eq(siteContent.key, key)).get();
  return (row?.value as T) ?? fallback;
}

async function putSetting(key: string, value: unknown) {
  await db
    .insert(siteContent)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } });
}

async function getAdminPassword(): Promise<string> {
  const settings = await getSetting<{ password?: string }>("settings", {});
  return settings.password || DEFAULT_ADMIN_PASSWORD;
}

// Seed songs from static content on first run.
async function ensureSeeded() {
  const count = await db.select().from(songs).all();
  if (count.length === 0) {
    let sort = 0;
    for (const p of musicProjects) {
      await db.insert(songs).values({
        title: p.title,
        description: p.description,
        roles: p.roles,
        image: p.image,
        spotify: p.spotify ?? "",
        youtube: p.youtube ?? "",
        link: p.link ?? "",
        linkLabel: p.linkLabel ?? "",
        sort: sort++,
        published: true,
      });
    }
  }
  // Seed site content defaults so every admin field is pre-filled with the
  // real visible copy. Only inserts keys that don't exist yet — never clobbers
  // a value Carlos has already edited.
  for (const [key, value] of Object.entries(CONTENT_DEFAULTS)) {
    const existing = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, key))
      .get();
    if (!existing) {
      await db.insert(siteContent).values({ key, value, updatedAt: new Date() });
    }
  }
}

function requireAuth(c: { req: { header: (k: string) => string | undefined } }): boolean {
  const auth = c.req.header("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "");
  return verifyToken(token);
}

const app = new Hono()
  .basePath("api")
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .get("/ping", (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get("/health", (c) => c.json({ status: "ok" }, 200))

  // ---- AUTH ----
  .post("/admin/login", async (c) => {
    const body = await c.req.json<{ password?: string }>().catch(() => ({}));
    const pw = await getAdminPassword();
    if (!body.password || body.password !== pw) {
      return c.json({ error: "Invalid password" }, 401);
    }
    return c.json({ token: makeToken() }, 200);
  })
  .get("/admin/verify", (c) => c.json({ ok: requireAuth(c) }, 200))
  .post("/admin/password", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const body = await c.req.json<{ password?: string }>().catch(() => ({}));
    if (!body.password || body.password.length < 4)
      return c.json({ error: "Password too short" }, 400);
    const settings = await getSetting<Record<string, unknown>>("settings", {});
    await putSetting("settings", { ...settings, password: body.password });
    return c.json({ ok: true }, 200);
  })

  // ---- SONGS (public read) ----
  .get("/songs", async (c) => {
    await ensureSeeded();
    const rows = await db.select().from(songs).orderBy(asc(songs.sort)).all();
    const isAdmin = requireAuth(c);
    return c.json(isAdmin ? rows : rows.filter((r) => r.published), 200);
  })
  .post("/songs", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const b = await c.req.json();
    const max = (await db.select().from(songs).all()).reduce((m, s) => Math.max(m, s.sort), -1);
    const row = await db
      .insert(songs)
      .values({
        title: b.title ?? "Untitled",
        description: b.description ?? "",
        roles: b.roles ?? [],
        image: b.image ?? "",
        spotify: b.spotify ?? "",
        youtube: b.youtube ?? "",
        link: b.link ?? "",
        linkLabel: b.linkLabel ?? "",
        sort: b.sort ?? max + 1,
        published: b.published ?? true,
      })
      .returning()
      .get();
    return c.json(row, 200);
  })
  .put("/songs/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    const b = await c.req.json();
    const row = await db
      .update(songs)
      .set({
        title: b.title,
        description: b.description,
        roles: b.roles,
        image: b.image,
        spotify: b.spotify,
        youtube: b.youtube,
        link: b.link,
        linkLabel: b.linkLabel,
        sort: b.sort,
        published: b.published,
      })
      .where(eq(songs.id, id))
      .returning()
      .get();
    return c.json(row, 200);
  })
  .delete("/songs/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    await db.delete(songs).where(eq(songs.id, id));
    return c.json({ ok: true }, 200);
  })
  // Bulk reorder: body = { ids: number[] } in the new display order.
  .post("/songs/reorder", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const b = await c.req.json<{ ids: number[] }>().catch(() => ({ ids: [] }));
    let sort = 0;
    for (const id of b.ids ?? []) {
      await db.update(songs).set({ sort: sort++ }).where(eq(songs.id, id));
    }
    return c.json({ ok: true }, 200);
  })

  // ---- CUSTOM SECTIONS (page builder) ----
  .get("/custom-sections", async (c) => {
    const rows = await db
      .select()
      .from(customSections)
      .orderBy(asc(customSections.sort))
      .all();
    const isAdmin = requireAuth(c);
    return c.json(isAdmin ? rows : rows.filter((r) => r.published), 200);
  })
  .post("/custom-sections", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const b = await c.req.json();
    const max = (await db.select().from(customSections).all()).reduce(
      (m, s) => Math.max(m, s.sort),
      -1,
    );
    const row = await db
      .insert(customSections)
      .values({
        type: b.type ?? "text",
        data: b.data ?? {},
        style: b.style ?? {},
        sort: b.sort ?? max + 1,
        published: b.published ?? true,
      })
      .returning()
      .get();
    return c.json(row, 200);
  })
  .put("/custom-sections/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    const b = await c.req.json();
    const row = await db
      .update(customSections)
      .set({
        type: b.type,
        data: b.data,
        style: b.style,
        sort: b.sort,
        published: b.published,
      })
      .where(eq(customSections.id, id))
      .returning()
      .get();
    return c.json(row, 200);
  })
  .delete("/custom-sections/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    await db.delete(customSections).where(eq(customSections.id, id));
    return c.json({ ok: true }, 200);
  })
  .post("/custom-sections/reorder", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const b = await c.req.json<{ ids: number[] }>().catch(() => ({ ids: [] }));
    let sort = 0;
    for (const id of b.ids ?? []) {
      await db.update(customSections).set({ sort: sort++ }).where(eq(customSections.id, id));
    }
    return c.json({ ok: true }, 200);
  })

  // ---- SITE CONTENT ----
  .get("/content/:key", async (c) => {
    await ensureSeeded();
    const key = c.req.param("key");
    const row = await db.select().from(siteContent).where(eq(siteContent.key, key)).get();
    return c.json(
      { key, value: row?.value ?? CONTENT_DEFAULTS[key] ?? null },
      200,
    );
  })
  .put("/content/:key", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const key = c.req.param("key");
    const body = await c.req.json<{ value: unknown }>();
    await putSetting(key, body.value);
    return c.json({ ok: true }, 200);
  })

  // ---- CONTACT ----
  .post("/contact", async (c) => {
    const b = await c.req.json<{
      name?: string;
      email?: string;
      subject?: string;
      body?: string;
      website?: string; // honeypot
    }>().catch(() => ({}));
    // honeypot: bots fill hidden "website" field → silently accept, do nothing
    if (b.website) return c.json({ ok: true }, 200);
    const name = (b.name ?? "").trim().slice(0, 120);
    const email = (b.email ?? "").trim().slice(0, 160);
    const subject = (b.subject ?? "").trim().slice(0, 200);
    const body = (b.body ?? "").trim().slice(0, 5000);
    if (!name || !email || !body || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return c.json({ error: "Please fill in your name, a valid email and a message." }, 400);
    }
    // store first so nothing is ever lost
    await db.insert(messages).values({ name, email, subject, body, read: false });

    // fire the email via Resend (works in production — never exposes the address)
    const to = (await getSetting<{ contactEmail?: string }>("settings", {})).contactEmail
      || "c.picardo27@gmail.com";
    const html = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:8px">
          <div style="border-left:3px solid #00D4AA;padding-left:16px;margin-bottom:20px">
            <h2 style="margin:0 0 4px;font-size:18px;color:#111">New message from your portfolio</h2>
            <p style="color:#888;margin:0;font-size:14px">${esc(subject) || "(no subject)"}</p>
          </div>
          <table style="font-size:14px;line-height:1.6;margin-bottom:16px">
            <tr><td style="color:#999;padding-right:14px">From</td><td><b>${esc(name)}</b></td></tr>
            <tr><td style="color:#999;padding-right:14px">Email</td><td><a href="mailto:${esc(email)}" style="color:#00a888">${esc(email)}</a></td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:0 0 16px"/>
          <p style="white-space:pre-wrap;font-size:15px;line-height:1.65;color:#222">${esc(body)}</p>
          <p style="margin-top:24px;font-size:12px;color:#bbb">Reply directly to this email to respond to ${esc(name)}.</p>
        </div>`;
    const sent = await sendEmail({
      to,
      subject: `Portfolio · ${subject || "New message"} — from ${name}`,
      replyTo: email,
      html,
    });
    return c.json({ ok: true, emailed: sent.ok }, 200);
  })
  .get("/messages", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const rows = await db.select().from(messages).orderBy(descOrder(messages.createdAt)).all();
    return c.json(rows, 200);
  })
  .put("/messages/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    const b = await c.req.json<{ read?: boolean }>().catch(() => ({}));
    await db.update(messages).set({ read: b.read ?? true }).where(eq(messages.id, id));
    return c.json({ ok: true }, 200);
  })
  .delete("/messages/:id", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const id = Number(c.req.param("id"));
    await db.delete(messages).where(eq(messages.id, id));
    return c.json({ ok: true }, 200);
  })

  // ---- EPK / PRESS KIT (real vector PDF, generated with @react-pdf/renderer —
  // no headless-Chrome dependency, so this works identically in production) ----
  .get("/epk", async (c) => {
    const about = await getSetting<Record<string, string>>("about", {});
    const epr = await getSetting<Record<string, string>>("epr", {});
    const exp = await getSetting<Record<string, string>>("experience", {});
    const certs = await getSetting<Record<string, string>>("certifications", {});
    const socials = await getSetting<Record<string, string>>("socials", {});
    const allSongs = await db.select().from(songs).orderBy(asc(songs.sort)).all();

    const certItems = (certs.items || "").split("\n").filter(Boolean);
    const expBullets = (exp.bullets || "").split("\n").filter(Boolean);
    const credits = allSongs
      .filter((sg) => sg.published !== false)
      .slice(0, 18)
      .map((sg) => ({
        title: sg.title,
        roles: (Array.isArray(sg.roles) ? sg.roles : []).join(" · "),
      }));

    const eprLink = epr.link || "https://eprstandard.com";
    const ig = (socials.instagram || "https://instagram.com/carlos.picardo/").replace(/^https?:\/\/(www\.)?/, "");
    const email = socials.email || "c.picardo27@gmail.com";
    const year = new Date().getFullYear();
    const portraitPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/images/profile-bw.jpg");

    const pdfBuffer = await renderEpkPdf({
      about,
      epr,
      exp,
      certItems,
      expBullets,
      credits,
      eprLink,
      email,
      instagram: ig,
      year,
      portraitPath,
    });

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Carlos-Picardo-Press-Kit.pdf"',
        "Cache-Control": "no-store",
      },
    });
  })
  // ---- UPLOADS ----
  .post("/upload", async (c) => {
    if (!requireAuth(c)) return c.json({ error: "Unauthorized" }, 401);
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return c.json({ error: "No file" }, 400);
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const key = randomKey(ext);
    const bytes = new Uint8Array(await file.arrayBuffer());
    await putObject(key, bytes, file.type || "application/octet-stream");
    return c.json({ url: `/api/media/${encodeURIComponent(key)}` }, 200);
  })
  .get("/media/:key{.+}", async (c) => {
    const raw = c.req.param("key");
    let key = raw;
    try {
      key = decodeURIComponent(raw);
    } catch {
      /* already decoded */
    }
    try {
      const { bytes, contentType, etag } = await getObject(key);
      const tag = etag || `W/"${key}-${bytes.byteLength}"`;
      if (c.req.header("if-none-match") === tag) {
        return new Response(null, {
          status: 304,
          headers: { etag: tag, "cache-control": "public, max-age=31536000, immutable" },
        });
      }
      return new Response(bytes, {
        status: 200,
        headers: {
          "content-type": contentType,
          "content-length": String(bytes.byteLength),
          "cache-control": "public, max-age=31536000, immutable",
          etag: tag,
        },
      });
    } catch {
      return c.json({ error: "Not found" }, 404);
    }
  });

export type AppType = typeof app;
export default app;
