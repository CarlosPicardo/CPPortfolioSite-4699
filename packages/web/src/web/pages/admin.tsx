import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";
import {
  getToken,
  setToken,
  clearToken,
  authHeaders,
  type Song,
} from "../lib/content";
import { CONTENT_DEFAULTS } from "../content/defaults";
import {
  BLOCK_TYPES,
  blockMeta,
  SWATCHES,
  type CustomSection,
  type SectionType,
  type SectionStyle,
} from "../content/sections";

// ---------- small UI helpers ----------
const inputCls =
  "w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#00D4AA] focus:outline-none transition-colors";
const labelCls = "block text-xs uppercase tracking-wider text-white/50 mb-1.5";
const btnPrimary =
  "px-4 py-2 rounded-lg bg-[#00D4AA] text-black text-sm font-semibold hover:bg-[#00bd98] transition-colors disabled:opacity-50 cursor-pointer";
const btnGhost =
  "px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:border-white/40 transition-colors cursor-pointer";

// ---------- live-preview bridge ----------
// The admin keeps an <iframe src="/?preview=1"> and posts draft values to it so
// the public site updates instantly as Carlos types — no DB writes until Save.
const PreviewCtx = {
  win: null as Window | null,
  ready: false,
  queue: [] as unknown[],
};

function postDraft(msg: unknown) {
  if (PreviewCtx.win && PreviewCtx.ready) {
    PreviewCtx.win.postMessage(msg, "*");
  } else {
    PreviewCtx.queue.push(msg);
  }
}

function useDebouncedDraft() {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  return useCallback((id: string, msg: unknown, delay = 250) => {
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => postDraft(msg), delay);
  }, []);
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea
          className={inputCls + " min-h-[90px] resize-y"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="text-white/30 text-[11px] mt-1">{hint}</p>}
    </div>
  );
}

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-[#00D4AA] text-black px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-[fadeIn_0.2s]">
      {msg}
    </div>
  );
}

// ---------- image upload ----------
// Downscale + re-encode in the browser before uploading.
// Phone photos / exported artwork are often 5-12 MB, which makes covers load
// slowly (or fail entirely) on mobile data. Covers never render bigger than
// ~700px on the site, so 1400px @ q0.85 JPEG is plenty and lands around 150-300 KB.
const MAX_DIM = 1400;
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    // Small already-light files: leave untouched.
    if (scale === 1 && file.size < 400_000) {
      bitmap.close();
      return file;
    }
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function uploadImage(input: File): Promise<string> {
  const file = await compressImage(input);
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });
  if (!res.ok) throw new Error("upload failed");
  const { url } = await res.json();
  return url;
}

function ImageUpload({
  label = "Image",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <img
            src={value}
            className="w-16 h-16 rounded-lg object-cover border border-white/10"
            alt=""
          />
        )}
        <label className={btnGhost + " inline-flex items-center"}>
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                onChange(await uploadImage(f));
              } catch {
                alert("Upload failed");
              }
              setBusy(false);
            }}
          />
        </label>
      </div>
      <input
        className={inputCls + " mt-2"}
        value={value}
        placeholder="…or paste image URL"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ---------- Login ----------
function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr("");
    const res = await api.admin.login.$post({ json: { password: pw } });
    setBusy(false);
    if (!res.ok) {
      setErr("Wrong password");
      return;
    }
    const { token } = await res.json();
    setToken(token);
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="w-full max-w-sm">
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin
        </h1>
        <p className="text-white/40 text-sm mb-6">Carlos Picardo — Portfolio CMS</p>
        <input
          type="password"
          className={inputCls}
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
        <button className={btnPrimary + " w-full mt-4"} disabled={busy} onClick={submit}>
          {busy ? "…" : "Sign in"}
        </button>
        <p className="text-white/25 text-xs mt-4 text-center">
          Use the private password configured for this deployment.
        </p>
      </div>
    </div>
  );
}

// ---------- Songs tab ----------
const emptySong: Song = {
  title: "",
  description: "",
  roles: [],
  image: "",
  spotify: "",
  youtube: "",
  link: "",
  linkLabel: "",
};

function SongsTab({ toast }: { toast: (m: string) => void }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [editing, setEditing] = useState<Song | null>(null);
  const dragId = useRef<number | null>(null);
  const draft = useDebouncedDraft();

  const load = useCallback(async () => {
    const res = await fetch("/api/songs", { headers: { ...authHeaders() } });
    const data: Song[] = await res.json();
    setSongs(data);
    postDraft({ type: "epr-draft-songs", songs: data });
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  // push the live draft whenever the edit form changes
  useEffect(() => {
    if (!editing) return;
    const norm: Song = {
      ...editing,
      roles:
        typeof (editing.roles as unknown) === "string"
          ? (editing.roles as unknown as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : editing.roles,
    };
    const merged = editing.id
      ? songs.map((s) => (s.id === editing.id ? norm : s))
      : [norm, ...songs];
    draft("songs", { type: "epr-draft-songs", songs: merged });
  }, [editing, songs, draft]);

  const save = async () => {
    if (!editing) return;
    const body = {
      ...editing,
      roles:
        typeof (editing.roles as unknown) === "string"
          ? (editing.roles as unknown as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : editing.roles,
    };
    if (editing.id) {
      await fetch(`/api/songs/${editing.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/songs", {
        method: "POST",
        headers: { "content-type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
    }
    setEditing(null);
    await load();
    toast("Saved");
  };

  const del = async (id?: number) => {
    if (!id || !confirm("Delete this song?")) return;
    await fetch(`/api/songs/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
    await load();
    toast("Deleted");
  };

  // drag-to-reorder
  const onDrop = async (targetId?: number) => {
    const from = dragId.current;
    dragId.current = null;
    if (from == null || targetId == null || from === targetId) return;
    const next = [...songs];
    const fromIdx = next.findIndex((s) => s.id === from);
    const toIdx = next.findIndex((s) => s.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setSongs(next);
    postDraft({ type: "epr-draft-songs", songs: next });
    await fetch("/api/songs/reorder", {
      method: "POST",
      headers: { "content-type": "application/json", ...authHeaders() },
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
    toast("Order saved");
  };

  if (editing) {
    const rolesStr = Array.isArray(editing.roles)
      ? editing.roles.join(", ")
      : (editing.roles as unknown as string);
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          {editing.id ? "Edit song" : "New song"}
        </h2>
        <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
        <Field label="Description" textarea value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
        <Field
          label="Roles (comma separated)"
          value={rolesStr}
          placeholder="Producer, Mixing Engineer"
          onChange={(v) => setEditing({ ...editing, roles: v as unknown as string[] })}
        />
        <ImageUpload label="Cover image" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
        <Field label="Spotify Track ID" value={editing.spotify ?? ""} placeholder="6dw04fT3QQrVVtTPzkeBXC" onChange={(v) => setEditing({ ...editing, spotify: v })} hint="The ID after /track/ in a Spotify link." />
        <Field label="YouTube Video ID" value={editing.youtube ?? ""} placeholder="4MM2SRy6Joo" onChange={(v) => setEditing({ ...editing, youtube: v })} hint="The part after watch?v= in a YouTube link." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Extra link (any URL)" value={editing.link ?? ""} placeholder="https://drive.google.com/…" onChange={(v) => setEditing({ ...editing, link: v })} hint="Optional — unreleased session, Drive, etc." />
          <Field label="Link button label" value={editing.linkLabel ?? ""} placeholder="Studio session" onChange={(v) => setEditing({ ...editing, linkLabel: v })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={editing.published ?? true}
            onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
          />
          Published (visible on site)
        </label>
        <div className="flex gap-3 pt-2">
          <button className={btnPrimary} onClick={save}>Save</button>
          <button className={btnGhost} onClick={() => { setEditing(null); load(); }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Music Projects ({songs.length})</h2>
        <button className={btnPrimary} onClick={() => setEditing({ ...emptySong })}>+ Add song</button>
      </div>
      <p className="text-white/30 text-xs mb-4">Drag the ⠿ handle to reorder. Order is saved automatically.</p>
      <div className="space-y-2">
        {songs.map((s) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => (dragId.current = s.id ?? null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(s.id)}
            className="flex items-center gap-3 bg-[#141414] border border-white/8 rounded-lg p-3 hover:border-white/20 transition-colors"
          >
            <span className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 select-none px-1" title="Drag to reorder">⠿</span>
            {s.image ? (
              <img src={s.image} className="w-12 h-12 rounded object-cover" alt="" />
            ) : (
              <div className="w-12 h-12 rounded bg-white/5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{s.title}</p>
              <p className="text-white/40 text-xs truncate">{s.roles.join(" · ")}</p>
            </div>
            {s.link && <span className="text-[10px] text-[#00D4AA]/70 uppercase" title="Has extra link">↗ link</span>}
            {!s.published && <span className="text-[10px] text-amber-400 uppercase">Hidden</span>}
            <button className={btnGhost} onClick={() => setEditing(s)}>Edit</button>
            <button className="text-red-400/70 hover:text-red-400 text-sm px-2 cursor-pointer" onClick={() => del(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Generic JSON-section tab (pre-filled from API/defaults) ----------
interface FieldDef {
  key: string;
  label: string;
  textarea?: boolean;
  image?: boolean;
  hint?: string;
  es?: boolean; // offer an optional Spanish (ES) companion field
}

// Collapsible Spanish-override input shown under a translatable field.
function EsField({
  label,
  textarea,
  value,
  onChange,
}: {
  label: string;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(!!value);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] text-[#00D4AA]/70 hover:text-[#00D4AA] cursor-pointer -mt-2"
      >
        + Add Spanish (ES)
      </button>
    );
  }
  return (
    <div className="-mt-2 rounded-lg border border-[#00D4AA]/20 bg-[#00D4AA]/[0.03] p-2">
      <Field label={`🇪🇸 ${label} — Español`} textarea={textarea} value={value} onChange={onChange} />
    </div>
  );
}

function ContentTab({
  sectionKey,
  title,
  fields,
  toast,
}: {
  sectionKey: string;
  title: string;
  fields: FieldDef[];
  toast: (m: string) => void;
}) {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const draft = useDebouncedDraft();

  useEffect(() => {
    fetch(`/api/content/${sectionKey}`)
      .then((r) => r.json())
      .then((j) => {
        const fallback = (CONTENT_DEFAULTS[sectionKey] as Record<string, string>) ?? {};
        setData({ ...fallback, ...((j.value as Record<string, string>) ?? {}) });
      });
  }, [sectionKey]);

  const update = (key: string, v: string) => {
    setData((d) => {
      const next = { ...(d ?? {}), [key]: v };
      draft(`content-${sectionKey}`, {
        type: "epr-draft-content",
        key: sectionKey,
        value: next,
      });
      return next;
    });
  };

  const save = async () => {
    await fetch(`/api/content/${sectionKey}`, {
      method: "PUT",
      headers: { "content-type": "application/json", ...authHeaders() },
      body: JSON.stringify({ value: data }),
    });
    toast("Saved");
  };

  if (!data) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {fields.map((f) =>
        f.image ? (
          <ImageUpload
            key={f.key}
            label={f.label}
            value={data[f.key] ?? ""}
            onChange={(v) => update(f.key, v)}
          />
        ) : (
          <div key={f.key} className="space-y-2">
            <Field
              label={f.label}
              textarea={f.textarea}
              hint={f.hint}
              value={data[f.key] ?? ""}
              onChange={(v) => update(f.key, v)}
            />
            {f.es && (
              <EsField
                label={f.label}
                textarea={f.textarea}
                value={data[`${f.key}_es`] ?? ""}
                onChange={(v) => update(`${f.key}_es`, v)}
              />
            )}
          </div>
        ),
      )}
      <button className={btnPrimary} onClick={save}>Save</button>
    </div>
  );
}

// ============================================================================
//  SECTIONS TAB — the no-code page builder
// ============================================================================

// small labelled control row
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

// color picker: swatches + custom input
function ColorControl({
  label,
  value,
  swatches,
  allowNone,
  onChange,
}: {
  label: string;
  value?: string;
  swatches: string[];
  allowNone?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <Row label={label}>
      {swatches.map((sw) => (
        <button
          key={sw}
          title={sw}
          onClick={() => onChange(sw)}
          className={`w-6 h-6 rounded-md border cursor-pointer ${value === sw ? "border-[#00D4AA] ring-2 ring-[#00D4AA]/40" : "border-white/15"}`}
          style={
            sw === "transparent"
              ? { backgroundImage: "linear-gradient(45deg,#444 25%,transparent 25%,transparent 75%,#444 75%),linear-gradient(45deg,#444 25%,transparent 25%,transparent 75%,#444 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0,4px 4px" }
              : { background: sw }
          }
        />
      ))}
      <input
        type="color"
        value={value && value !== "transparent" ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded-md border border-white/15 bg-transparent cursor-pointer p-0"
        title="Custom color"
      />
      {allowNone && (
        <button onClick={() => onChange("transparent")} className="text-[10px] text-white/40 hover:text-white px-1 cursor-pointer">none</button>
      )}
    </Row>
  );
}

function StylePanel({
  type,
  style,
  onChange,
}: {
  type: SectionType;
  style: SectionStyle;
  onChange: (s: SectionStyle) => void;
}) {
  const set = (patch: Partial<SectionStyle>) => onChange({ ...style, ...patch });
  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-[#101010] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#00D4AA]">Style</p>

      <Row label="Font">
        {(["display", "body", "mono"] as const).map((f) => (
          <button
            key={f}
            onClick={() => set({ font: f })}
            className={`px-2 py-1 rounded text-xs capitalize cursor-pointer ${style.font === f ? "bg-[#00D4AA] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
      </Row>

      <Row label={`Heading size (${style.headingSize ?? 4})`}>
        <input
          type="range" min={1} max={8} value={style.headingSize ?? 4}
          onChange={(e) => set({ headingSize: Number(e.target.value) })}
          className="w-28 accent-[#00D4AA] cursor-pointer"
        />
      </Row>

      <Row label="Align">
        {(["left", "center", "right"] as const).map((a) => (
          <button
            key={a}
            onClick={() => set({ align: a })}
            className={`px-2 py-1 rounded text-xs capitalize cursor-pointer ${(style.align ?? "left") === a ? "bg-[#00D4AA] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            {a}
          </button>
        ))}
      </Row>

      <Row label="Width">
        {(["narrow", "normal", "wide", "full"] as const).map((w) => (
          <button
            key={w}
            onClick={() => set({ maxWidth: w })}
            className={`px-2 py-1 rounded text-xs capitalize cursor-pointer ${(style.maxWidth ?? "normal") === w ? "bg-[#00D4AA] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
          >
            {w}
          </button>
        ))}
      </Row>

      <Row label={`Vertical space (${style.paddingY ?? 5})`}>
        <input
          type="range" min={1} max={8} value={style.paddingY ?? 5}
          onChange={(e) => set({ paddingY: Number(e.target.value) })}
          className="w-28 accent-[#00D4AA] cursor-pointer"
        />
      </Row>

      <ColorControl label="Background" value={style.bg} swatches={SWATCHES.bg} allowNone onChange={(v) => set({ bg: v })} />
      <ColorControl label="Text" value={style.fg} swatches={SWATCHES.fg} onChange={(v) => set({ fg: v })} />
      <ColorControl label="Accent" value={style.accent} swatches={SWATCHES.accent} onChange={(v) => set({ accent: v })} />

      <ImageUpload label="Background image (optional)" value={style.bgImage ?? ""} onChange={(v) => set({ bgImage: v })} />

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={!!style.rounded} onChange={(e) => set({ rounded: e.target.checked })} />
        Rounded corners on media
      </label>
    </div>
  );
}

// data editor switches by block type
function DataEditor({
  type,
  data,
  onChange,
}: {
  type: SectionType;
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const d = data as Record<string, string>;
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const F = (k: string, label: string, ta?: boolean, ph?: string, hint?: string) => (
    <Field label={label} value={d[k] ?? ""} textarea={ta} placeholder={ph} hint={hint} onChange={(v) => set(k, v)} />
  );

  switch (type) {
    case "text":
      return (
        <>
          {F("eyebrow", "Eyebrow (small label)")}
          {F("heading", "Heading")}
          {F("body", "Body text", true, "", "Separate paragraphs with a blank line.")}
        </>
      );
    case "image":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          <ImageUpload label="Image" value={d.image ?? ""} onChange={(v) => set("image", v)} />
          {F("caption", "Caption")}
          <Row label="Fit">
            {(["cover", "contain"] as const).map((fit) => (
              <button key={fit} onClick={() => set("fit", fit)} className={`px-2 py-1 rounded text-xs capitalize cursor-pointer ${(d.fit || "cover") === fit ? "bg-[#00D4AA] text-black" : "bg-white/5 text-white/60"}`}>{fit}</button>
            ))}
          </Row>
        </>
      );
    case "gallery": {
      const imgs = (data.images as string[]) ?? [];
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          <Row label={`Columns (${Number(data.columns) || 3})`}>
            <input type="range" min={2} max={4} value={Number(data.columns) || 3} onChange={(e) => set("columns", Number(e.target.value))} className="w-24 accent-[#00D4AA]" />
          </Row>
          <label className={labelCls}>Images</label>
          <div className="space-y-2">
            {imgs.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={img} className="w-12 h-12 rounded object-cover" alt="" />
                <button className="text-red-400/70 hover:text-red-400 text-xs cursor-pointer" onClick={() => set("images", imgs.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <ImageUpload label="Add image" value="" onChange={(v) => v && set("images", [...imgs, v])} />
        </>
      );
    }
    case "video":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          {F("url", "Video / embed URL", false, "https://youtube.com/watch?v=… or Spotify/Vimeo", "Paste a YouTube, Spotify or Vimeo link.")}
        </>
      );
    case "list":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          {F("items", "Items", true, "", 'One per line, format: "Title | detail".')}
          <Row label={`Columns (${Number(data.columns) || 2})`}>
            <input type="range" min={1} max={3} value={Number(data.columns) || 2} onChange={(e) => set("columns", Number(e.target.value))} className="w-24 accent-[#00D4AA]" />
          </Row>
        </>
      );
    case "stats":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          {F("items", "Numbers", true, "", 'One per line, format: "Number | label".')}
        </>
      );
    case "quote":
      return (
        <>
          {F("quote", "Quote", true)}
          {F("author", "Attribution")}
        </>
      );
    case "cta":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          {F("body", "Body text", true)}
          <div className="grid grid-cols-2 gap-3">
            {F("button1Label", "Button 1 label")}
            {F("button1Url", "Button 1 URL")}
            {F("button2Label", "Button 2 label (optional)")}
            {F("button2Url", "Button 2 URL")}
          </div>
        </>
      );
    case "band":
      return (
        <>
          {F("eyebrow", "Eyebrow")}
          {F("heading", "Heading")}
          {F("body", "Body text", true)}
          {F("tagline", "Tagline (italic accent)")}
          <div className="grid grid-cols-2 gap-3">
            {F("buttonLabel", "Button label")}
            {F("buttonUrl", "Button URL")}
          </div>
          <ImageUpload label="Background image (optional)" value={d.image ?? ""} onChange={(v) => set("image", v)} />
        </>
      );
    default:
      return null;
  }
}

function SectionsTab({ toast }: { toast: (m: string) => void }) {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [editing, setEditing] = useState<CustomSection | null>(null);
  const [picking, setPicking] = useState(false);
  const dragId = useRef<number | null>(null);
  const draft = useDebouncedDraft();

  const load = useCallback(async () => {
    const res = await fetch("/api/custom-sections", { headers: { ...authHeaders() } });
    const data: CustomSection[] = await res.json();
    setSections(data);
    postDraft({ type: "epr-draft-sections", sections: data });
  }, []);
  useEffect(() => { load(); }, [load]);

  // live preview while editing
  useEffect(() => {
    if (!editing) return;
    const merged = editing.id
      ? sections.map((s) => (s.id === editing.id ? editing : s))
      : [...sections, editing];
    draft("sections", { type: "epr-draft-sections", sections: merged });
  }, [editing, sections, draft]);

  const startNew = (type: SectionType) => {
    const meta = blockMeta(type);
    setEditing({ type, data: { ...meta.defaultData }, style: { ...meta.defaultStyle }, published: true });
    setPicking(false);
  };

  const save = async () => {
    if (!editing) return;
    const body = { type: editing.type, data: editing.data, style: editing.style, published: editing.published ?? true };
    if (editing.id) {
      await fetch(`/api/custom-sections/${editing.id}`, { method: "PUT", headers: { "content-type": "application/json", ...authHeaders() }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/custom-sections", { method: "POST", headers: { "content-type": "application/json", ...authHeaders() }, body: JSON.stringify(body) });
    }
    setEditing(null);
    await load();
    toast("Section saved");
  };

  const del = async (id?: number) => {
    if (!id || !confirm("Delete this section?")) return;
    await fetch(`/api/custom-sections/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
    await load();
    toast("Deleted");
  };

  const onDrop = async (targetId?: number) => {
    const from = dragId.current;
    dragId.current = null;
    if (from == null || targetId == null || from === targetId) return;
    const next = [...sections];
    const fi = next.findIndex((s) => s.id === from);
    const ti = next.findIndex((s) => s.id === targetId);
    if (fi < 0 || ti < 0) return;
    const [m] = next.splice(fi, 1);
    next.splice(ti, 0, m);
    setSections(next);
    postDraft({ type: "epr-draft-sections", sections: next });
    await fetch("/api/custom-sections/reorder", { method: "POST", headers: { "content-type": "application/json", ...authHeaders() }, body: JSON.stringify({ ids: next.map((s) => s.id) }) });
    toast("Order saved");
  };

  // ---- editor view ----
  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editing.id ? "Edit" : "New"} · {blockMeta(editing.type).label}
          </h2>
          <span className="text-xs text-white/30">{blockMeta(editing.type).desc}</span>
        </div>
        <DataEditor type={editing.type} data={editing.data} onChange={(data) => setEditing({ ...editing, data })} />
        <StylePanel type={editing.type} style={editing.style} onChange={(style) => setEditing({ ...editing, style })} />
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
          Published (visible on site)
        </label>
        <div className="flex gap-3 pt-1">
          <button className={btnPrimary} onClick={save}>Save section</button>
          <button className={btnGhost} onClick={() => { setEditing(null); load(); }}>Cancel</button>
        </div>
      </div>
    );
  }

  // ---- block picker ----
  if (picking) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Choose a block</h2>
          <button className={btnGhost} onClick={() => setPicking(false)}>Cancel</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BLOCK_TYPES.map((b) => (
            <button
              key={b.type}
              onClick={() => startNew(b.type)}
              className="text-left rounded-xl border border-white/10 bg-[#141414] p-4 hover:border-[#00D4AA]/60 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <p className="text-sm font-semibold text-white">{b.label}</p>
              <p className="text-xs text-white/40 mt-1">{b.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---- list view ----
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Custom Sections ({sections.length})</h2>
        <button className={btnPrimary} onClick={() => setPicking(true)}>+ Add section</button>
      </div>
      <p className="text-white/30 text-xs mb-4">
        Build new parts of your page — no code. Drag ⠿ to reorder. These appear after the EPR Standard section.
      </p>
      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
          <p className="text-white/50 text-sm">No custom sections yet.</p>
          <p className="text-white/30 text-xs mt-1">Click “Add section” to drop in a text block, gallery, feature band, and more.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((s) => {
            const meta = blockMeta(s.type);
            const title = (s.data as Record<string, string>).heading || (s.data as Record<string, string>).quote || meta.label;
            return (
              <div
                key={s.id}
                draggable
                onDragStart={() => (dragId.current = s.id ?? null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(s.id)}
                className="flex items-center gap-3 bg-[#141414] border border-white/8 rounded-lg p-3 hover:border-white/20 transition-colors"
              >
                <span className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 select-none px-1" title="Drag to reorder">⠿</span>
                <span className="text-[10px] uppercase tracking-wider text-[#00D4AA]/80 w-16 shrink-0">{meta.label}</span>
                <p className="flex-1 min-w-0 text-white text-sm font-medium truncate">{title}</p>
                {!s.published && <span className="text-[10px] text-amber-400 uppercase">Hidden</span>}
                <button className={btnGhost} onClick={() => setEditing(s)}>Edit</button>
                <button className="text-red-400/70 hover:text-red-400 text-sm px-2 cursor-pointer" onClick={() => del(s.id)}>Delete</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- Settings tab ----------
// ============================================================================
//  INBOX TAB — messages from the contact form
// ============================================================================
interface Msg {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string | number | Date;
}

function InboxTab({ toast }: { toast: (m: string) => void }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/messages", { headers: { ...authHeaders() } });
    if (res.ok) setMsgs(await res.json());
    else setMsgs([]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (m: Msg) => {
    if (!m.read) {
      await fetch(`/api/messages/${m.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json", ...authHeaders() },
        body: JSON.stringify({ read: true }),
      });
      setMsgs((list) => list?.map((x) => (x.id === m.id ? { ...x, read: true } : x)) ?? null);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
    setMsgs((list) => list?.filter((x) => x.id !== id) ?? null);
    toast("Deleted");
  };

  const fmt = (d: Msg["createdAt"]) => {
    try {
      return new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (!msgs) return <div className="text-white/40 text-sm">Loading…</div>;

  const unread = msgs.filter((m) => !m.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Inbox {unread > 0 && <span className="ml-2 rounded-full bg-[#00D4AA] px-2 py-0.5 text-xs font-semibold text-black">{unread} new</span>}
        </h2>
        <button className={btnGhost} onClick={load}>Refresh</button>
      </div>
      {msgs.length === 0 ? (
        <p className="text-white/40 text-sm">No messages yet. Your contact form posts will land here.</p>
      ) : (
        <div className="space-y-2">
          {msgs.map((m) => {
            const isOpen = open === m.id;
            return (
              <div
                key={m.id}
                className={`rounded-xl border p-4 transition-colors ${m.read ? "border-white/8 bg-[#101010]" : "border-[#00D4AA]/30 bg-[#00D4AA]/[0.04]"}`}
              >
                <div
                  className="flex cursor-pointer items-start justify-between gap-3"
                  onClick={() => {
                    setOpen(isOpen ? null : m.id);
                    if (!isOpen) markRead(m);
                  }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#00D4AA]" />}
                      <span className="font-semibold text-white truncate">{m.name}</span>
                      <span className="text-xs text-white/40 truncate">{m.email}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-white/70 truncate">{m.subject || "(no subject)"}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-white/35">{fmt(m.createdAt)}</span>
                </div>
                {isOpen && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="whitespace-pre-wrap text-sm text-white/80">{m.body}</p>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`}
                        className={btnPrimary}
                      >
                        Reply by email
                      </a>
                      <button className={btnGhost} onClick={() => del(m.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettingsTab({ toast }: { toast: (m: string) => void }) {
  const [pw, setPw] = useState("");
  const change = async () => {
    if (pw.length < 4) return alert("Min 4 chars");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "content-type": "application/json", ...authHeaders() },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      toast("Password updated");
      setPw("");
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Settings</h2>
      <Field label="New admin password" value={pw} onChange={setPw} />
      <button className={btnPrimary} onClick={change}>Update password</button>
    </div>
  );
}

// ---------- tab content definitions ----------
const CONTENT_TABS: Record<string, { title: string; fields: FieldDef[] }> = {
  Hero: {
    title: "Hero",
    fields: [
      { key: "eyebrow", label: "Role line (under name)" },
      { key: "image", label: "Background image", image: true },
    ],
  },
  About: {
    title: "About",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading1", label: "Heading — line 1" },
      { key: "heading2", label: "Heading — line 2 (teal)" },
      { key: "intro", label: "Intro paragraph (always visible)", textarea: true, es: true },
      { key: "body1", label: "Body paragraph 1 (under Read more)", textarea: true, es: true },
      { key: "body2", label: "Body paragraph 2", textarea: true, es: true },
      { key: "body3", label: "Body paragraph 3", textarea: true, es: true },
      { key: "imageBw", label: "Portrait — black & white", image: true },
      { key: "imageColor", label: "Portrait — colour (reveal)", image: true },
    ],
  },
  Experience: {
    title: "Experience",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "studio", label: "Studio name" },
      { key: "location", label: "Location · scholarship" },
      { key: "body", label: "Description", textarea: true, es: true },
      { key: "bullets", label: "Bullet points", textarea: true, hint: "One per line." },
      { key: "image", label: "Studio photo", image: true },
    ],
  },
  Certifications: {
    title: "Certifications",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "items", label: "Certifications", textarea: true, hint: 'One per line, format: "Name | detail".' },
    ],
  },
  EPR: {
    title: "EPR Standard section",
    fields: [
      { key: "eyebrow", label: "Eyebrow (e.g. Founder & CEO)" },
      { key: "title", label: "Title" },
      { key: "body", label: "Body / manifesto", textarea: true, es: true },
      { key: "tagline", label: "Tagline" },
      { key: "link", label: "Link URL" },
    ],
  },
  Listen: {
    title: "Listen section",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "body", label: "Body text", textarea: true, es: true },
    ],
  },
  Music: {
    title: "Discography heading",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "body", label: "Intro text", textarea: true, es: true },
    ],
  },
  Contact: {
    title: "Contact form",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "body", label: "Intro text", textarea: true, es: true },
      { key: "buttonLabel", label: "Send button label" },
    ],
  },
  SEO: {
    title: "SEO & share links",
    fields: [
      { key: "title", label: "Page title (browser tab + Google)" },
      { key: "description", label: "Description (search + social preview)", textarea: true },
      { key: "image", label: "Share image (Open Graph)", image: true },
      { key: "url", label: "Canonical site URL" },
    ],
  },
  Socials: {
    title: "Connect & socials",
    fields: [
      { key: "connectIntro", label: "Intro text", textarea: true, es: true },
      { key: "instagram", label: "Instagram URL" },
      { key: "youtube", label: "YouTube URL" },
      { key: "tiktok", label: "TikTok URL" },
      { key: "spotify", label: "Spotify URL" },
      { key: "email", label: "Email" },
    ],
  },
};

// ---------- Main ----------
const TABS = [
  "Inbox",
  "Songs",
  "Sections",
  "Hero",
  "About",
  "Experience",
  "Certifications",
  "EPR",
  "Listen",
  "Music",
  "Contact",
  "Socials",
  "SEO",
  "Settings",
] as const;

const SECTION_ANCHOR: Record<string, string> = {
  Inbox: "#connect",
  Songs: "#music",
  Sections: "#epr",
  Music: "#music",
  Hero: "#top",
  About: "#about",
  Experience: "#experience",
  Certifications: "#certs",
  EPR: "#epr",
  Listen: "#listen",
  Contact: "#connect",
  Socials: "#connect",
  SEO: "#top",
  Settings: "#top",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Songs");
  const [toastMsg, setToastMsg] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(""), 2000);
  };

  useEffect(() => {
    const t = getToken();
    if (!t) {
      setChecking(false);
      return;
    }
    fetch("/api/admin/verify", { headers: { authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((j) => setAuthed(!!j.ok))
      .finally(() => setChecking(false));
  }, []);

  // listen for the preview iframe announcing it's ready, then flush queue
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "epr-preview-ready") {
        PreviewCtx.win = iframeRef.current?.contentWindow ?? null;
        PreviewCtx.ready = true;
        PreviewCtx.queue.forEach((m) => PreviewCtx.win?.postMessage(m, "*"));
        PreviewCtx.queue = [];
      }
    };
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      PreviewCtx.win = null;
      PreviewCtx.ready = false;
    };
  }, [authed]);

  // scroll the preview to the relevant section when changing tabs
  useEffect(() => {
    const anchor = SECTION_ANCHOR[tab];
    if (anchor && PreviewCtx.win) {
      PreviewCtx.win.postMessage({ type: "epr-scroll-to", anchor }, "*");
    }
  }, [tab]);

  if (checking) return <div className="min-h-screen bg-[#0A0A0A]" />;
  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  const TabBody = () => {
    if (tab === "Inbox") return <InboxTab toast={toast} />;
    if (tab === "Songs") return <SongsTab toast={toast} />;
    if (tab === "Sections") return <SectionsTab toast={toast} />;
    if (tab === "Settings") return <SettingsTab toast={toast} />;
    const def = CONTENT_TABS[tab];
    const key = tab.toLowerCase();
    return <ContentTab sectionKey={key} title={def.title} fields={def.fields} toast={toast} />;
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-white overflow-hidden">
      <header className="border-b border-white/8 bg-[#0A0A0A]/95 backdrop-blur-xl z-20 shrink-0">
        <div className="px-6 h-14 flex items-center justify-between">
          <span className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Portfolio CMS
          </span>
          <div className="flex items-center gap-4">
            <button
              className={`text-sm cursor-pointer ${showPreview ? "text-[#00D4AA]" : "text-white/50 hover:text-white"}`}
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-white">Open site ↗</a>
            <button
              className="text-sm text-white/50 hover:text-white cursor-pointer"
              onClick={() => {
                clearToken();
                setAuthed(false);
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* editor panel */}
        <div className={`flex min-h-0 ${showPreview ? "w-full lg:w-[46%] xl:w-[40%]" : "w-full"}`}>
          <nav className="w-32 sm:w-40 shrink-0 border-r border-white/8 overflow-y-auto p-3 space-y-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  tab === t ? "bg-[#00D4AA] text-black font-semibold" : "text-white/60 hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <main className="flex-1 min-w-0 overflow-y-auto p-6">
            <TabBody />
          </main>
        </div>

        {/* live preview */}
        {showPreview && (
          <div className="hidden lg:flex flex-1 min-w-0 flex-col border-l border-white/8 bg-black">
            <div className="h-9 shrink-0 flex items-center gap-2 px-4 border-b border-white/8 bg-[#141414]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]/70" />
              <span className="text-xs text-white/40">Live preview · updates as you type</span>
            </div>
            <iframe
              ref={iframeRef}
              src="/?preview=1"
              title="Live preview"
              className="flex-1 w-full bg-[#0A0A0A]"
            />
          </div>
        )}
      </div>
      <Toast msg={toastMsg} />
    </div>
  );
}
