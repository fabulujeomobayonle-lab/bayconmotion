import { supabase as supabaseTyped } from "@/integrations/supabase/client";

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

const INITIAL_WORKS: Work[] = [
  {
    id: "demo-1",
    title: "VIRAL SAAS FOUNDER REEL",
    category: "Talking Head",
    description: "Fast-paced vertical talking head reel with kinetic captions, floating 3D browser popups, and sound FX drops.",
    status: "published",
    embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    video_url: null,
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "YOUTUBE TECH MASTERCLASS",
    category: "Motion Graphics",
    description: "14-minute tutorial video transformed into a cinema-grade masterclass with animated code highlights and diagrams.",
    status: "published",
    embed_url: "https://www.youtube.com/embed/L_LUpnjgPso",
    video_url: null,
    thumbnail_url: "https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "BUSINESS EMPIRE COMMERCIAL",
    category: "Business Edit",
    description: "Aggressive, high-conversion commercial spot for a cryptocurrency trading brand with fast glitch cuts.",
    status: "published",
    embed_url: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    video_url: null,
    thumbnail_url: "https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

const STORAGE_KEY_WORKS = "baycon_works_v2";
const STORAGE_KEY_REVIEWS = "baycon_reviews_v2";

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
    return Array.isArray(parsed) ? parsed : INITIAL_WORKS;
  } catch {
    return INITIAL_WORKS;
  }
}

export function saveLocalWork(work: Omit<Work, "id" | "created_at" | "sort_order"> & { id?: string }): Work {
  const current = getLocalWorks();
  let updatedWork: Work;

  if (work.id) {
    const existing = current.find((w) => w.id === work.id);
    let finalId = work.id;

    // If existing item has a non-UUID demo ID, upgrade it to a real UUID so Supabase accepts it
    if (!isUuid(finalId)) {
      finalId = crypto.randomUUID();
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
      id: crypto.randomUUID(),
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
        const newUuid = crypto.randomUUID();
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
      id: crypto.randomUUID(),
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

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
