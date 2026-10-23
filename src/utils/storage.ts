import { supabase as supabaseTyped } from "@/integrations/supabase/client";

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return 'uuid-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
};

const supabase = supabaseTyped as unknown as {
  from: (table: string) => any;
};

export type Work = {
  id: string;
  title: string;
  category: "Talking Head" | "Motion Graphics" | "Random Edit" | "Business Edit" | "General Editing";
  description: string | null;
  status: "draft" | "published";
  embed_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
};

export type ClientReview = {
  id: string;
  client_name: string;
  client_role: string | null;
  quote: string;
  rating: number;
  project_title: string | null;
  embed_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type PastClientSocials = {
  youtube?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  website?: string | null;
};

export type PastClient = {
  id: string;
  client_name: string;
  company_or_niche?: string | null;
  avatar_url?: string | null;
  video_title: string;
  video_url: string;
  video_urls?: string[];
  embed_url?: string | null;
  thumbnail_url?: string | null;
  results_highlight?: string | null;
  testimonial_quote?: string | null;
  socials: PastClientSocials;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
};

export const INITIAL_WORKS: Work[] = [
  {
    id: "ef2cd025-d964-489c-8e6b-bf0b39f724e6",
    title: "turning raw footage to a viral talking head",
    category: "Talking Head",
    description: "Turning raw talking head footage into an engaging, fast-paced experience 🔥\nAdded smooth cuts, captions, sound design, zooms, and visual effects to improve retention.",
    status: "published",
    embed_url: "https://www.youtube.com/shorts/7ecfQbWEiIU?feature=share",
    video_url: null,
    thumbnail_url: "https://messtlmcuoowaxfbntkl.supabase.co/storage/v1/object/sign/works-thumbnails/8412e8f2-2723-41a0-9d50-d4284d7d4cd0.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzUzNzRlZS04MzU1LTQ4NDQtOTA4MC00M2I0Nzg4NTJkYjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3b3Jrcy10aHVtYm5haWxzLzg0MTJlOGYyLTI3MjMtNDFhMC05ZDUwLWQ0Mjg0ZDdkNGNkMC5qcGVnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MTUyNTYyOCwiZXhwIjozMzU4MzI1NjI4fQ.moelUds4-X4FQ9v0Xp6BxOx2IY0dafAGLXUQdI7OvP8",
    sort_order: 1,
    created_at: "2026-06-15T12:13:49.407Z",
  },
  {
    id: "c6d6ecfb-42ae-4905-a8a2-c6df14c6940c",
    title: "High-Retention YouTube Edit",
    category: "Talking Head",
    description: "A high-energy creator edit inspired by the fast-paced style of modern YouTube content. This project focuses on audience retention through dynamic pacing, engaging cuts, sound design, motion effects, and seamless transitions.\n\nThe goal was to transform raw footage into an entertaining viewing experience while maintaining the creator's personality and energy.\n\nEdited with DaVinci Resolve.",
    status: "published",
    embed_url: "https://youtube.com/shorts/HOfw5dRqRPw?feature=share",
    video_url: null,
    thumbnail_url: "https://messtlmcuoowaxfbntkl.supabase.co/storage/v1/object/sign/works-thumbnails/e2daffe4-ba65-4c54-9f86-452997127450.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85MzUzNzRlZS04MzU1LTQ4NDQtOTA4MC00M2I0Nzg4NTJkYjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3b3Jrcy10aHVtYm5haWxzL2UyZGFmZmU0LWJhNjUtNGM1NC05Zjg2LTQ1Mjk5NzEyNzQ1MC5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgyMjM1MzE0LCJleHAiOjMzNTkwMzUzMTR9.Kl6naU50dIyzkrgCqpCpsHcx-KOTckrChQxPy8ztXWM",
    sort_order: 2,
    created_at: "2026-06-23T17:21:55.632Z",
  },
];

export const BANNED_WORK_IDS = new Set<string>([]);

const STORAGE_KEY_WORKS = "baycon_works_v2";
const STORAGE_KEY_REVIEWS = "baycon_reviews_v2";
const STORAGE_KEY_DELETED = "baycon_deleted_works_v2";
const STORAGE_KEY_MESSAGES = "baycon_messages_v1";
const STORAGE_KEY_PAST_CLIENTS = "baycon_past_clients_v2";

export function getDeletedWorkIds(): Set<string> {
  try {
    if (typeof window === "undefined") return new Set();
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    const set = new Set(Array.isArray(arr) ? arr : []);
    // Ensure real videos are never blocked by stale deleted list
    set.delete("ef2cd025-d964-489c-8e6b-bf0b39f724e6");
    set.delete("c6d6ecfb-42ae-4905-a8a2-c6df14c6940c");
    return set;
  } catch {
    return new Set();
  }
}

export function addDeletedWorkId(id: string): void {
  try {
    if (typeof window === "undefined") return;
    const set = getDeletedWorkIds();
    set.add(id);
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(Array.from(set)));
  } catch {}
}

export function isValidWork(w: any): boolean {
  if (!w || typeof w !== "object") return false;
  if (!w.id || typeof w.id !== "string") return false;
  if (w.id.startsWith("demo-")) return false;
  if (BANNED_WORK_IDS.has(w.id)) return false;
  if (getDeletedWorkIds().has(w.id)) return false;

  // Filter out placeholder mock template items only
  const lowerTitle = (w.title || "").toLowerCase().trim();
  if (
    lowerTitle.includes("luxury brand launch ad") ||
    lowerTitle.includes("fintech app 3d explainer")
  ) {
    return false;
  }

  return true;
}

try {
  if (typeof window !== "undefined") {
    localStorage.removeItem("baycon_works");
    localStorage.removeItem("baycon_works_v1");
    localStorage.removeItem("baycon_demo_works");
    // Clean up deleted list if it contained the real user video IDs
    const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
    if (deletedRaw) {
      try {
        const deletedArr = JSON.parse(deletedRaw);
        if (Array.isArray(deletedArr)) {
          const filtered = deletedArr.filter(
            (id: string) => id !== "ef2cd025-d964-489c-8e6b-bf0b39f724e6" && id !== "c6d6ecfb-42ae-4905-a8a2-c6df14c6940c"
          );
          localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(filtered));
        }
      } catch {}
    }
  }
} catch {}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(id: string | null | undefined): boolean {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

export function getLocalWorks(): Work[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WORKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(INITIAL_WORKS));
      return INITIAL_WORKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(INITIAL_WORKS));
      return INITIAL_WORKS;
    }

    // Filter out obsolete legacy items and demo items
    const cleaned = parsed.filter(isValidWork);
    // If all items were filtered out (due to previous bug), restore initial works
    if (cleaned.length === 0 && INITIAL_WORKS.length > 0) {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(INITIAL_WORKS));
      return INITIAL_WORKS;
    }
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return INITIAL_WORKS;
  }
}

export function clearAllWorks(): void {
  try {
    localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify([]));
  } catch {}

  (async () => {
    try {
      // Clear all works from Supabase
      await supabase.from("works").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (err) {
      console.warn("Supabase clear works warning:", err);
    }
  })();
}

export function saveLocalWork(work: Omit<Work, "id" | "created_at" | "sort_order"> & { id?: string }): Work {
  const current = getLocalWorks();
  let updatedWork: Work;

  if (work.id) {
    const existing = current.find((w) => w.id === work.id);
    let finalId = work.id;

    // If existing item has a non-UUID demo ID, upgrade it to a real UUID so Supabase accepts it
    if (!isUuid(finalId)) {
      finalId = generateId();
    }

    updatedWork = {
      ...(existing || {}),
      ...work,
      id: finalId,
      created_at: existing?.created_at || new Date().toISOString(),
      sort_order: existing?.sort_order || 1,
    } as Work;

    const next = current.map((w) => (w.id === work.id ? updatedWork : w));
    localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(next));

    // Sync to Supabase
    (async () => {
      try {
        if (isUuid(work.id)) {
          await supabase.from("works").update(updatedWork).eq("id", work.id);
        } else {
          await supabase.from("works").upsert(updatedWork);
        }
      } catch (err) {
        console.warn("Supabase work update sync warning:", err);
      }
    })();
  } else {
    updatedWork = {
      ...work,
      id: generateId(),
      sort_order: current.length + 1,
      created_at: new Date().toISOString(),
    };
    const next = [updatedWork, ...current];
    localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(next));

    (async () => {
      try {
        await supabase.from("works").insert(updatedWork);
      } catch (err) {
        console.warn("Supabase work insert sync warning:", err);
      }
    })();
  }

  return updatedWork;
}

export function deleteLocalWork(id: string): void {
  addDeletedWorkId(id);
  const current = getLocalWorks();
  const next = current.filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(next));

  (async () => {
    try {
      if (isUuid(id)) {
        await supabase.from("works").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase work delete sync warning:", err);
    }
  })();
}

export function toggleLocalWorkStatus(id: string): "published" | "draft" {
  const current = getLocalWorks();
  let newStatus: "published" | "draft" = "draft";
  let targetWork: Work | undefined;

  const next = current.map((w) => {
    if (w.id === id) {
      newStatus = w.status === "published" ? "draft" : "published";
      targetWork = { ...w, status: newStatus };
      return targetWork;
    }
    return w;
  });

  localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(next));

  // Sync status change to Supabase
  (async () => {
    try {
      if (isUuid(id)) {
        await supabase.from("works").update({ status: newStatus }).eq("id", id);
      } else if (targetWork) {
        // Upgrade demo work to UUID and upsert so database recognizes it
        const newUuid = generateId();
        const upgraded = { ...targetWork, id: newUuid };
        const updatedList = getLocalWorks().map((w) => (w.id === id ? upgraded : w));
        localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(updatedList));
        await supabase.from("works").upsert(upgraded);
      }
    } catch (err) {
      console.warn("Supabase toggle status sync warning:", err);
    }
  })();

  return newStatus;
}

export function getLocalReviews(): ClientReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalReview(review: Omit<ClientReview, "id" | "created_at" | "sort_order"> & { id?: string }): ClientReview {
  const current = getLocalReviews();
  let updated: ClientReview;

  if (review.id) {
    updated = {
      ...current.find((r) => r.id === review.id)!,
      ...review,
    } as ClientReview;
    const next = current.map((r) => (r.id === review.id ? updated : r));
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(next));
  } else {
    updated = {
      ...review,
      id: generateId(),
      sort_order: current.length + 1,
      created_at: new Date().toISOString(),
    };
    const next = [updated, ...current];
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(next));
  }

  (async () => {
    try {
      if (review.id) {
        await supabase.from("client_reviews").update(updated).eq("id", review.id);
      } else {
        await supabase.from("client_reviews").insert(updated);
      }
    } catch {}
  })();

  return updated;
}

export function deleteLocalReview(id: string): void {
  const current = getLocalReviews();
  const next = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(next));

  (async () => {
    try {
      await supabase.from("client_reviews").delete().eq("id", id);
    } catch {}
  })();
}

export function getLocalMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalMessage(msg: Omit<ContactMessage, "id" | "created_at" | "is_read">): ContactMessage {
  const current = getLocalMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: generateId(),
    is_read: false,
    created_at: new Date().toISOString(),
  };

  const next = [newMessage, ...current];
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(next));

  (async () => {
    try {
      await supabase.from("contact_messages").insert({
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        project_type: newMessage.project_type,
        message: newMessage.message,
        is_read: newMessage.is_read,
        created_at: newMessage.created_at,
      });
    } catch (err) {
      console.warn("Supabase contact_messages insert sync warning:", err);
    }
  })();

  return newMessage;
}

export function toggleLocalMessageRead(id: string): boolean {
  const current = getLocalMessages();
  let newStatus = false;
  const next = current.map((m) => {
    if (m.id === id) {
      newStatus = !m.is_read;
      return { ...m, is_read: newStatus };
    }
    return m;
  });
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(next));

  (async () => {
    try {
      await supabase.from("contact_messages").update({ is_read: newStatus }).eq("id", id);
    } catch (err) {
      console.warn("Supabase contact_messages update sync warning:", err);
    }
  })();

  return newStatus;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const INITIAL_PAST_CLIENTS: PastClient[] = [];

// ─── PAST CLIENTS BACKED BY THE WORKS TABLE ───────────────────────────────
// The past_clients table doesn't exist yet in Supabase, but the works table
// is fully open with anon write access. We store past clients as works with:
//   category = "General Editing"
//   description = "__PAST_CLIENT::{json}"
// This gives perfect cross-device sync without needing a new table.

const PAST_CLIENT_PREFIX = "__PAST_CLIENT::";

function encodePastClient(client: PastClient): string {
  return PAST_CLIENT_PREFIX + JSON.stringify({
    client_name: client.client_name,
    socials: client.socials || {},
    video_urls: client.video_urls || (client.video_url ? [client.video_url] : []),
    video_url: client.video_url,
  });
}

function decodePastClientWork(w: any): PastClient | null {
  try {
    if (!w.description || !w.description.startsWith(PAST_CLIENT_PREFIX)) return null;
    const data = JSON.parse(w.description.slice(PAST_CLIENT_PREFIX.length));
    return {
      id: w.id,
      client_name: data.client_name || w.title,
      video_title: `${data.client_name || w.title}'s Video`,
      video_url: data.video_url || w.video_url || w.embed_url || "",
      video_urls: data.video_urls || (data.video_url ? [data.video_url] : []),
      embed_url: w.embed_url || null,
      thumbnail_url: w.thumbnail_url || null,
      socials: data.socials || {},
      status: w.status === "published" ? "published" : "draft",
      sort_order: w.sort_order || 0,
      created_at: w.created_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function getLocalPastClients(): PastClient[] {
  try {
    // Pull from local works that are past clients
    const works = getLocalWorks();
    const fromWorks = works
      .map(decodePastClientWork)
      .filter(Boolean) as PastClient[];

    // Also check legacy key
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PAST_CLIENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Filter out demo/initial placeholder clients
          const legacy = parsed.filter(
            (c: any) => c.id && !c.id.startsWith("client-") && !fromWorks.find(w => w.id === c.id)
          );
          return [...fromWorks, ...legacy];
        }
      }
    } catch {}

    return fromWorks;
  } catch {
    return [];
  }
}

export function saveLocalPastClient(
  client: Omit<PastClient, "id" | "created_at" | "sort_order"> & { id?: string }
): PastClient {
  const description = encodePastClient({
    ...client,
    id: client.id || "",
    sort_order: 0,
    created_at: new Date().toISOString(),
  });

  const primaryVideo = client.video_urls?.[0] || client.video_url || "";

  const workPayload = {
    id: client.id,
    title: client.client_name,
    category: "General Editing" as const,
    description,
    status: client.status,
    embed_url: client.embed_url || primaryVideo || null,
    video_url: primaryVideo || null,
    thumbnail_url: client.thumbnail_url || null,
  };

  const savedWork = saveLocalWork(workPayload);

  return {
    id: savedWork.id,
    client_name: client.client_name,
    video_title: `${client.client_name}'s Video`,
    video_url: primaryVideo,
    video_urls: client.video_urls || (primaryVideo ? [primaryVideo] : []),
    embed_url: client.embed_url || primaryVideo || null,
    thumbnail_url: client.thumbnail_url || null,
    socials: client.socials || {},
    status: client.status,
    sort_order: savedWork.sort_order,
    created_at: savedWork.created_at,
  };
}

export function deleteLocalPastClient(id: string): void {
  deleteLocalWork(id);
}

export function toggleLocalPastClientStatus(id: string): "published" | "draft" {
  return toggleLocalWorkStatus(id) as "published" | "draft";
}

export async function syncLocalPastClientsToSupabase(): Promise<void> {
  // No-op: past clients are now works, they sync automatically via saveLocalWork
}


