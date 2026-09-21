import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "./api";
import type { MusicProject } from "../content/projects";
import { musicProjects as fallbackSongs } from "../content/projects";
import type { CustomSection } from "../content/sections";

export interface Song extends MusicProject {
  id?: number;
  sort?: number;
  published?: boolean;
}

const ADMIN_TOKEN_KEY = "epr_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { authorization: `Bearer ${t}` } : {};
}

/** Songs — DB-backed with static fallback. */
export function useSongs() {
  return useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await api.songs.$get();
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as Song[];
      return data.length ? data : fallbackSongs;
    },
    placeholderData: fallbackSongs,
    staleTime: 30_000,
  });
}

/** Custom page-builder sections — DB-backed, ordered by sort. */
export function useCustomSections() {
  return useQuery<CustomSection[]>({
    queryKey: ["custom-sections"],
    queryFn: async () => {
      const res = await api["custom-sections"].$get();
      if (!res.ok) throw new Error("failed");
      return (await res.json()) as CustomSection[];
    },
    placeholderData: [],
    staleTime: 30_000,
  });
}

/** Generic site content section with a fallback default. */
export function useContent<T>(key: string, fallback: T) {
  return useQuery<T>({
    queryKey: ["content", key],
    queryFn: async () => {
      const res = await api.content[":key"].$get({ param: { key } });
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as { value: T | null };
      return json.value ?? fallback;
    },
    placeholderData: fallback,
    staleTime: 30_000,
  });
}

/**
 * Live-preview bridge. When the public site is rendered inside the admin's
 * preview iframe, the admin posts draft content here and we write it straight
 * into the React Query cache so the page updates instantly as Carlos types —
 * without touching the database. Mount this once at the app root.
 */
export type DraftMessage =
  | { type: "epr-draft-content"; key: string; value: unknown }
  | { type: "epr-draft-songs"; songs: Song[] }
  | { type: "epr-draft-sections"; sections: CustomSection[] }
  | { type: "epr-scroll-to"; anchor: string };

export function useDraftPreview() {
  const qc = useQueryClient();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMsg = (e: MessageEvent) => {
      const msg = e.data as DraftMessage;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "epr-draft-content") {
        qc.setQueryData(["content", msg.key], msg.value);
      } else if (msg.type === "epr-draft-songs") {
        qc.setQueryData(["songs"], msg.songs);
      } else if (msg.type === "epr-draft-sections") {
        qc.setQueryData(["custom-sections"], msg.sections);
      } else if (msg.type === "epr-scroll-to") {
        if (msg.anchor === "#top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document
            .querySelector(msg.anchor)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    window.addEventListener("message", onMsg);
    // tell the parent we're ready to receive drafts
    try {
      window.parent?.postMessage({ type: "epr-preview-ready" }, "*");
    } catch {
      /* ignore */
    }
    return () => window.removeEventListener("message", onMsg);
  }, [qc]);
}
