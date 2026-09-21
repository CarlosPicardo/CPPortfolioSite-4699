import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Songs / Music Projects — editable from the admin panel.
 */
export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  roles: text("roles", { mode: "json" }).notNull().$type<string[]>().default([]),
  image: text("image").notNull().default(""),
  spotify: text("spotify").default(""),
  youtube: text("youtube").default(""),
  link: text("link").default(""),
  linkLabel: text("link_label").default(""),
  sort: integer("sort").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Singleton site content — one row per section key, value is JSON.
 * Keys: hero, about, experience, certifications, epr, socials, settings
 */
export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull().$type<unknown>(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Custom sections — the no-code page builder. Each row is a fully self-described
 * section the user creates from the admin: a block type (text/image/gallery/
 * video/list/cta/band), its content (JSON), and per-section style overrides
 * (typography, colors, spacing, alignment). Rendered between the fixed sections
 * on the public page, ordered by `sort`.
 */
export const customSections = sqliteTable("custom_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull().default("text"),
  data: text("data", { mode: "json" }).notNull().$type<unknown>().default({}),
  style: text("style", { mode: "json" }).notNull().$type<unknown>().default({}),
  sort: integer("sort").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Contact form messages — submitted from the public site, emailed to Carlos
 * and stored here so he has an inbox in the admin even if email fails.
 */
export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull().default(""),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
