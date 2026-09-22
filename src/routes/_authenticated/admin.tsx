import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
// Database type isn't regenerated yet for new tables; use an untyped facade for table ops.
const supabase = supabaseTyped as unknown as {
  auth: typeof supabaseTyped.auth;
  storage: typeof supabaseTyped.storage;
  from: (table: string) => any;
};
import { LogOut, Pencil, Trash2, Plus, Upload, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Baycon CMS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Work = {
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

type Message = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type ClientReview = {
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

const reviewSchema = z.object({
  client_name: z.string().trim().min(1, "Client name is required").max(120),
  client_role: z.string().trim().max(160).optional().or(z.literal("")),
  project_title: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(1, "Review text is required").max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  status: z.enum(["draft", "published"]),
  embed_url: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
});

const CATEGORIES = ["Motion Graphics", "Talking Head", "Random Edit", "Business Edit"] as const;
const LONG_EXPIRY = 60 * 60 * 24 * 365 * 50; // ~50 years

const workSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  category: z.enum(CATEGORIES),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  embed_url: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
});

function AdminPage() {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Work | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [editingReview, setEditingReview] = useState<ClientReview | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [tab, setTab] = useState<"works" | "reviews" | "messages">("works");

  async function loadReviews() {
    const { data, error } = await supabase
      .from("client_reviews")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setReviews((data ?? []) as unknown as ClientReview[]);
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this client review?")) return;
    const { error } = await supabase.from("client_reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadReviews();
  }

  async function toggleReviewStatus(r: ClientReview) {
    const next = r.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("client_reviews").update({ status: next }).eq("id", r.id);
    if (error) return toast.error(error.message);
    loadReviews();
  }

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setWorks((data ?? []) as unknown as Work[]);
    setLoading(false);
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setMessages((data ?? []) as unknown as Message[]);
  }

  useEffect(() => {
    load();
    loadMessages();
    loadReviews();
  }, []);

  async function markRead(m: Message) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !m.is_read })
      .eq("id", m.id);
    if (error) return toast.error(error.message);
    loadMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadMessages();
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this work permanently?")) return;
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function handleToggleStatus(w: Work) {
    const next = w.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("works")
      .update({ status: next })
      .eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success(next === "published" ? "Published" : "Moved to draft");
    load();
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold neon-text">Not an admin</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but doesn't have admin permissions. Ask an existing admin to grant you access.
          </p>
          <button onClick={handleSignOut} className="mt-6 rounded-md neon-border px-5 py-2 text-xs uppercase tracking-widest hover:bg-primary/10">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-black tracking-widest neon-text">
            BAYCON <span className="text-muted-foreground text-xs ml-2 tracking-normal font-normal">/ admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              View Site <ExternalLink className="h-3 w-3" />
            </Link>
            <button onClick={handleSignOut} className="rounded-md neon-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary/10 inline-flex items-center gap-2">
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setTab("works")}
            className={`px-4 py-3 text-xs uppercase tracking-widest border-b-2 transition ${tab === "works" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Works
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`px-4 py-3 text-xs uppercase tracking-widest border-b-2 transition ${tab === "reviews" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Client Reviews
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`px-4 py-3 text-xs uppercase tracking-widest border-b-2 transition inline-flex items-center gap-2 ${tab === "messages" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Messages
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">{unreadCount}</span>
            )}
          </button>
        </div>

        {tab === "messages" ? (
          <MessagesPanel messages={messages} onToggleRead={markRead} onDelete={deleteMessage} />
        ) : tab === "reviews" ? (
          <ReviewsPanel
            reviews={reviews}
            onNew={() => { setEditingReview(null); setShowReviewForm(true); }}
            onEdit={(r) => { setEditingReview(r); setShowReviewForm(true); }}
            onDelete={deleteReview}
            onToggleStatus={toggleReviewStatus}
          />
        ) : (
        <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-black neon-text">Your Works</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload videos, paste embed links, manage what's live on your site.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="rounded-md bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Work
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : works.length === 0 ? (
          <div className="rounded-2xl neon-border bg-card/30 p-12 text-center">
            <p className="text-muted-foreground">No works yet. Click <strong>New Work</strong> to upload your first piece.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {works.map((w) => (
              <div key={w.id} className="glass rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-full md:w-32 aspect-video rounded-md neon-border bg-black overflow-hidden flex items-center justify-center">
                  {w.thumbnail_url ? (
                    <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">▶</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold truncate">{w.title}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${w.status === "published" ? "bg-primary text-primary-foreground" : "neon-border text-muted-foreground"}`}>
                      {w.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{w.category}</span>
                  </div>
                  {w.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{w.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleStatus(w)} className="text-[10px] uppercase tracking-widest px-3 py-2 rounded-md neon-border hover:bg-primary/10">
                    {w.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => { setEditing(w); setShowForm(true); }} className="p-2 rounded-md neon-border hover:bg-primary/10" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="p-2 rounded-md neon-border hover:bg-primary/10 text-primary" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </main>

      {showForm && (
        <WorkForm
          work={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}

function MessagesPanel({
  messages,
  onToggleRead,
  onDelete,
}: {
  messages: Message[];
  onToggleRead: (m: Message) => void;
  onDelete: (id: string) => void;
}) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl neon-border bg-card/30 p-12 text-center">
        <p className="text-muted-foreground">No messages yet. When someone submits the contact form, it will appear here.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-black neon-text">Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages sent from your contact form.</p>
      </div>
      <div className="grid gap-4">
        {messages.map((m) => (
          <div key={m.id} className={`glass rounded-xl p-5 ${!m.is_read ? "neon-border" : ""}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground">{m.name}</h3>
                  {!m.is_read && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-primary-foreground">New</span>
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.project_type}</span>
                </div>
                <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline">{m.email}</a>
                <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onToggleRead(m)} className="text-[10px] uppercase tracking-widest px-3 py-2 rounded-md neon-border hover:bg-primary/10">
                  {m.is_read ? "Mark unread" : "Mark read"}
                </button>
                <a href={`mailto:${m.email}?subject=Re: Your Baycon inquiry`} className="text-[10px] uppercase tracking-widest px-3 py-2 rounded-md neon-border hover:bg-primary/10">Reply</a>
                <button onClick={() => onDelete(m.id)} className="p-2 rounded-md neon-border hover:bg-primary/10 text-primary" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkForm({ work, onClose, onSaved }: { work: Work | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>("");

  async function uploadFile(bucket: string, file: File): Promise<string> {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (upErr) throw upErr;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, LONG_EXPIRY);
    if (error || !data) throw error ?? new Error("Failed to create signed URL");
    return data.signedUrl;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = workSchema.safeParse({
      title: form.get("title"),
      category: form.get("category"),
      description: form.get("description") ?? "",
      status: form.get("status"),
      embed_url: form.get("embed_url") ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSaving(true);
    try {
      let video_url = work?.video_url ?? null;
      let thumbnail_url = work?.thumbnail_url ?? null;

      if (videoFile) {
        if (videoFile.size > 200 * 1024 * 1024) throw new Error("Video must be under 200 MB");
        setProgress("Uploading video…");
        video_url = await uploadFile("works-videos", videoFile);
      }
      if (thumbFile) {
        if (thumbFile.size > 10 * 1024 * 1024) throw new Error("Thumbnail must be under 10 MB");
        setProgress("Uploading thumbnail…");
        thumbnail_url = await uploadFile("works-thumbnails", thumbFile);
      }

      setProgress("Saving…");
      const payload = {
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description || null,
        status: parsed.data.status,
        embed_url: parsed.data.embed_url || null,
        video_url,
        thumbnail_url,
      };

      if (work) {
        const { error } = await supabase.from("works").update(payload).eq("id", work.id);
        if (error) throw error;
      } else {
        const { data: u } = await supabase.auth.getUser();
        const { error } = await supabase.from("works").insert({ ...payload, created_by: u.user?.id });
        if (error) throw error;
      }
      toast.success(work ? "Updated" : "Created");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setProgress("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass neon-border rounded-2xl p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-black neon-text">{work ? "Edit Work" : "New Work"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input name="title" required defaultValue={work?.title ?? ""} maxLength={120} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select name="category" required defaultValue={work?.category === "General Editing" ? "Random Edit" : work?.category ?? "Random Edit"} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" required defaultValue={work?.status ?? "draft"} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea name="description" rows={3} maxLength={1000} defaultValue={work?.description ?? ""} className={inputCls + " resize-none"} />
          </Field>

          <Field label="YouTube / TikTok Embed URL (optional)">
            <input
              name="embed_url"
              type="url"
              defaultValue={work?.embed_url ?? ""}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              className={inputCls}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">YouTube: <code>https://www.youtube.com/embed/VIDEO_ID</code> · TikTok: <code>https://www.tiktok.com/embed/v2/VIDEO_ID</code></p>
          </Field>

          <Field label={`Video file (optional${work?.video_url ? ", current file kept if blank" : ""})`}>
            <label className="flex items-center justify-center gap-2 rounded-md neon-border bg-background/40 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:bg-primary/10">
              <Upload className="h-4 w-4" />
              {videoFile ? videoFile.name : "Choose video (.mp4, ≤200 MB)"}
              <input type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
            </label>
          </Field>

          <Field label={`Video thumbnail (optional${work?.thumbnail_url ? ", current image kept if blank" : ""})`}>
            <label className="flex items-center justify-center gap-2 rounded-md neon-border bg-background/40 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:bg-primary/10">
              <Upload className="h-4 w-4" />
              {thumbFile ? thumbFile.name : "Choose thumbnail image (≤10 MB)"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
            </label>
            <p className="mt-1 text-[10px] text-muted-foreground">Shown as the cover for a YouTube or TikTok link until a visitor presses play.</p>
          </Field>

          {progress && <p className="text-xs text-muted-foreground">{progress}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-md neon-border px-5 py-3 text-xs uppercase tracking-widest hover:bg-primary/10">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-md bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground neon-glow hover:brightness-110 disabled:opacity-60">
              {saving ? "Saving…" : work ? "Save Changes" : "Create Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md bg-input border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}