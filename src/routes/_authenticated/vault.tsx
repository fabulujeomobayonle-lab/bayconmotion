import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { LogOut, Pencil, Trash2, Plus, Upload, ExternalLink, ShieldCheck, Terminal, Download, RefreshCw, Cpu, Activity, Video, Star, MessageSquare } from "lucide-react";
import { parseYouTubeUrl } from "@/utils/video";
import {
  getLocalWorks,
  saveLocalWork,
  deleteLocalWork,
  toggleLocalWorkStatus,
  getLocalReviews,
  saveLocalReview,
  deleteLocalReview,
  fileToDataUrl,
  type Work,
  type ClientReview,
} from "@/utils/storage";

const supabase = supabaseTyped as unknown as {
  auth: typeof supabaseTyped.auth;
  storage: typeof supabaseTyped.storage;
  from: (table: string) => any;
};

export const Route = createFileRoute("/_authenticated/vault")({
  head: () => ({
    meta: [
      { title: "Quantum Vault — Baycon Secret Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VaultPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const CATEGORIES = ["Motion Graphics", "Talking Head", "Random Edit", "Business Edit"] as const;

const workSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  category: z.enum(CATEGORIES),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  embed_url: z.string().trim().max(1000).optional().or(z.literal("")),
});

const reviewSchema = z.object({
  client_name: z.string().trim().min(1, "Client name is required").max(120),
  client_role: z.string().trim().max(160).optional().or(z.literal("")),
  project_title: z.string().trim().max(160).optional().or(z.literal("")),
  quote: z.string().trim().min(1, "Review text is required").max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  status: z.enum(["draft", "published"]),
  embed_url: z.string().trim().max(1000).optional().or(z.literal("")),
});

function VaultPage() {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ClientReview | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"works" | "reviews" | "messages" | "terminal">("works");
  const [terminalLog, setTerminalLog] = useState<string[]>([
    "[SYSTEM INIT] Quantum Vault active.",
    "[SECURITY Check] Verified local admin credential state.",
  ]);

  function log(msg: string) {
    setTerminalLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  }

  function loadAll() {
    setLoading(true);
    // 1. Load local works & reviews
    const w = getLocalWorks();
    const r = getLocalReviews();
    setWorks(w);
    setReviews(r);
    log(`Loaded ${w.length} works and ${r.length} reviews from Vault storage.`);

    // 2. Fetch messages & sync
    (async () => {
      try {
        const { data: msgData } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (msgData) setMessages(msgData as unknown as Message[]);
      } catch {}
      setLoading(false);
    })();
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleSignOut() {
    localStorage.removeItem("baycon_admin");
    toast.success("Signed out of Vault");
    navigate({ to: "/auth" });
  }

  function exportBackupData() {
    const backup = {
      exported_at: new Date().toISOString(),
      works,
      reviews,
      messages,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baycon-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!");
    log("Exported full system JSON backup.");
  }

  const unreadMessages = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-background text-foreground scanlines selection:bg-cyan-400 selection:text-black">
      {/* HEADER */}
      <header className="border-b border-cyan-500/30 bg-background/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(0,255,249,0.8)]" />
            <Link to="/" className="font-display text-xl font-black tracking-widest text-cyan-400 neon-text">
              BAYCON <span className="text-muted-foreground text-xs ml-2 tracking-normal font-mono font-normal">/ quantum-vault</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportBackupData}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-mono font-bold text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
            >
              <Download className="h-3.5 w-3.5" /> Backup JSON
            </button>
            <Link
              to="/admin"
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Standard Admin →
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition inline-flex items-center gap-2"
            >
              <LogOut className="h-3.5 w-3.5" /> Exit Vault
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* VAULT STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-mono text-xs">
          <div className="rounded-xl border border-cyan-500/30 bg-card/60 p-4 backdrop-blur-md">
            <div className="text-muted-foreground text-[10px] uppercase tracking-widest">Total Published Works</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{works.filter((w) => w.status === "published").length}</div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-card/60 p-4 backdrop-blur-md">
            <div className="text-muted-foreground text-[10px] uppercase tracking-widest">Client Reviews</div>
            <div className="text-2xl font-bold text-primary mt-1">{reviews.length}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-card/60 p-4 backdrop-blur-md">
            <div className="text-muted-foreground text-[10px] uppercase tracking-widest">Storage Status</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">ONLINE</div>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-card/60 p-4 backdrop-blur-md">
            <div className="text-muted-foreground text-[10px] uppercase tracking-widest">Vault Security</div>
            <div className="text-2xl font-bold text-purple-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-5 w-5" /> ACTIVE
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="mb-8 flex items-center gap-2 border-b border-border font-mono text-xs">
          <button
            onClick={() => setActiveTab("works")}
            className={`px-4 py-3 uppercase tracking-widest border-b-2 transition flex items-center gap-2 ${
              activeTab === "works" ? "border-cyan-400 text-cyan-400 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Works Console ({works.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-3 uppercase tracking-widest border-b-2 transition flex items-center gap-2 ${
              activeTab === "reviews" ? "border-cyan-400 text-cyan-400 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-3.5 w-3.5" /> Client Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-3 uppercase tracking-widest border-b-2 transition flex items-center gap-2 ${
              activeTab === "messages" ? "border-cyan-400 text-cyan-400 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Messages
            {unreadMessages > 0 && (
              <span className="rounded-full bg-cyan-400 text-black text-[10px] font-bold px-2 py-0.5">{unreadMessages}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`px-4 py-3 uppercase tracking-widest border-b-2 transition flex items-center gap-2 ${
              activeTab === "terminal" ? "border-cyan-400 text-cyan-400 font-bold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" /> Logs & Diagnostic
          </button>
        </div>

        {/* TAB 1: WORKS CONSOLE */}
        {activeTab === "works" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-cyan-400 neon-text">Quantum Works Manager</h1>
                <p className="text-xs text-muted-foreground mt-1">Paste YouTube links or custom video URLs to publish instantly to your website.</p>
              </div>
              <button
                onClick={() => {
                  setEditingWork(null);
                  setShowWorkForm(true);
                }}
                className="rounded-lg bg-cyan-400 px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(0,255,249,0.5)] hover:brightness-110 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Work Link
              </button>
            </div>

            {loading ? (
              <p className="text-muted-foreground font-mono text-xs">Loading vault items…</p>
            ) : works.length === 0 ? (
              <div className="rounded-2xl border border-cyan-500/30 bg-card/30 p-12 text-center font-mono">
                <p className="text-muted-foreground text-xs">Vault is empty. Click <strong>Add Work Link</strong> to publish your first video.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {works.map((w) => (
                  <div key={w.id} className="glass rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 border border-border/60 hover:border-cyan-500/50 transition">
                    <div className="w-full md:w-36 aspect-video rounded-lg border border-cyan-500/30 bg-black overflow-hidden flex items-center justify-center shrink-0">
                      {w.thumbnail_url ? (
                        <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
                      ) : w.video_url ? (
                        <video src={w.video_url} className="w-full h-full object-cover" muted preload="metadata" />
                      ) : (
                        <span className="text-2xl text-cyan-400">▶</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold truncate text-foreground">{w.title}</h3>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            w.status === "published"
                              ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                              : "border border-border text-muted-foreground"
                          }`}
                        >
                          {w.status}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{w.category}</span>
                      </div>
                      {w.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{w.description}</p>}
                      {w.embed_url && (
                        <a href={w.embed_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline">
                          {w.embed_url} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          toggleLocalWorkStatus(w.id);
                          log(`Toggled status for work ${w.title}`);
                          loadAll();
                        }}
                        className="text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400"
                      >
                        {w.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingWork(w);
                          setShowWorkForm(true);
                        }}
                        className="p-2 rounded-md border border-border hover:bg-cyan-500/10 hover:text-cyan-400"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("Delete this work permanently?")) return;
                          deleteLocalWork(w.id);
                          log(`Deleted work ${w.title}`);
                          loadAll();
                        }}
                        className="p-2 rounded-md border border-red-500/40 hover:bg-red-500/10 text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REVIEWS CONSOLE */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-primary neon-text">Client Testimonials</h1>
                <p className="text-xs text-muted-foreground mt-1">Manage client review quotes, ratings, and video testimonials.</p>
              </div>
              <button
                onClick={() => {
                  setEditingReview(null);
                  setShowReviewForm(true);
                }}
                className="rounded-lg bg-primary px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,26,26,0.5)] hover:brightness-110 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-primary/30 bg-card/30 p-12 text-center font-mono">
                <p className="text-muted-foreground text-xs">No client reviews added. Click <strong>Add Review</strong> to add your first client testimonial.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="glass rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 border border-border/60">
                    <div className="w-full md:w-36 aspect-video rounded-lg border border-primary/30 bg-black overflow-hidden flex items-center justify-center shrink-0">
                      {r.thumbnail_url ? (
                        <img src={r.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl text-primary">★</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold truncate text-foreground">{r.client_name}</h3>
                        <span className="text-[10px] font-mono text-primary font-bold">{"★".repeat(r.rating)}</span>
                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${r.status === "published" ? "bg-primary/20 text-primary border border-primary/40" : "text-muted-foreground border border-border"}`}>
                          {r.status}
                        </span>
                      </div>
                      {r.project_title && <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.project_title}</p>}
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">"{r.quote}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <button
                        onClick={() => {
                          saveLocalReview({ ...r, status: r.status === "published" ? "draft" : "published" });
                          loadAll();
                        }}
                        className="text-[10px] uppercase tracking-widest px-3 py-2 rounded-md border border-primary/40 hover:bg-primary/10 text-primary"
                      >
                        {r.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingReview(r);
                          setShowReviewForm(true);
                        }}
                        className="p-2 rounded-md border border-border hover:bg-primary/10 hover:text-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("Delete this review?")) return;
                          deleteLocalReview(r.id);
                          loadAll();
                        }}
                        className="p-2 rounded-md border border-red-500/40 hover:bg-red-500/10 text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MESSAGES */}
        {activeTab === "messages" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl md:text-3xl font-black text-foreground">Inquiries & Leads</h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">Client inquiries submitted through your contact form.</p>
            </div>
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/30 p-12 text-center font-mono">
                <p className="text-muted-foreground text-xs">No client messages yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((m) => (
                  <div key={m.id} className="glass rounded-xl p-5 border border-border/80 font-mono">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-foreground">{m.name}</h3>
                          {!m.is_read && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-400 text-black">New</span>}
                          <span className="text-[10px] text-muted-foreground">{m.project_type}</span>
                        </div>
                        <a href={`mailto:${m.email}`} className="text-xs text-cyan-400 hover:underline">{m.email}</a>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(m.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${m.email}?subject=Re: Your Baycon Motion Inquiry`} className="text-[10px] uppercase tracking-widest px-3 py-2 rounded-md border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">Reply</a>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground font-sans whitespace-pre-wrap">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TERMINAL LOGS */}
        {activeTab === "terminal" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-black text-cyan-400 neon-text">System Terminal & Logs</h1>
                <p className="text-xs text-muted-foreground font-mono mt-1">Real-time event stream and data integrity check.</p>
              </div>
              <button
                onClick={loadAll}
                className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-mono text-cyan-400 hover:bg-cyan-400 hover:text-black transition inline-flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Diagnostic
              </button>
            </div>

            <div className="rounded-2xl border border-cyan-500/40 bg-black p-6 font-mono text-xs text-cyan-400 space-y-2 h-96 overflow-y-auto shadow-2xl">
              {terminalLog.map((l, idx) => (
                <div key={idx} className="leading-relaxed">
                  {l}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* WORK FORM MODAL */}
      {showWorkForm && (
        <VaultWorkForm
          work={editingWork}
          onClose={() => setShowWorkForm(false)}
          onSaved={() => {
            setShowWorkForm(false);
            loadAll();
          }}
        />
      )}

      {/* REVIEW FORM MODAL */}
      {showReviewForm && (
        <VaultReviewForm
          review={editingReview}
          onClose={() => setShowReviewForm(false)}
          onSaved={() => {
            setShowReviewForm(false);
            loadAll();
          }}
        />
      )}
    </div>
  );
}

function VaultWorkForm({ work, onClose, onSaved }: { work: Work | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

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
        video_url = URL.createObjectURL(videoFile);
      }
      if (thumbFile) {
        thumbnail_url = await fileToDataUrl(thumbFile);
      }

      let embed_url = parsed.data.embed_url || null;
      if (embed_url) {
        const parsedYt = parseYouTubeUrl(embed_url);
        if (parsedYt.embedUrl) {
          embed_url = parsedYt.embedUrl;
        }
        if (!thumbnail_url && parsedYt.thumbnailUrl) {
          thumbnail_url = parsedYt.thumbnailUrl;
        }
      }

      saveLocalWork({
        id: work?.id,
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description || null,
        status: parsed.data.status,
        embed_url,
        video_url,
        thumbnail_url,
      });

      toast.success(work ? "Work updated!" : "Work added to Vault!");
      onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save work");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass border border-cyan-500/40 rounded-2xl p-6 md:p-8 my-8 font-mono">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-black text-cyan-400 neon-text">{work ? "Edit Vault Work" : "New Vault Work"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <VaultField label="Title">
            <input name="title" required defaultValue={work?.title ?? ""} maxLength={120} className={vaultInputCls} />
          </VaultField>

          <div className="grid grid-cols-2 gap-4">
            <VaultField label="Category">
              <select name="category" required defaultValue={work?.category ?? "Random Edit"} className={vaultInputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </VaultField>
            <VaultField label="Status">
              <select name="status" required defaultValue={work?.status ?? "published"} className={vaultInputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </VaultField>
          </div>

          <VaultField label="Description (optional)">
            <textarea name="description" rows={3} maxLength={1000} defaultValue={work?.description ?? ""} className={vaultInputCls + " resize-none"} />
          </VaultField>

          <VaultField label="YouTube Link / Video URL">
            <input name="embed_url" type="text" defaultValue={work?.embed_url ?? ""} placeholder="e.g. https://www.youtube.com/watch?v=..." className={vaultInputCls} />
            <p className="mt-1 text-[10px] text-muted-foreground">Paste YouTube link here. Cover thumbnail will generate automatically.</p>
          </VaultField>

          <VaultField label={`Thumbnail Image (optional)`}>
            <label className="flex items-center justify-center gap-2 rounded-md border border-cyan-500/40 bg-background/40 px-4 py-3 text-xs uppercase tracking-widest cursor-pointer hover:bg-cyan-500/10 text-cyan-400">
              <Upload className="h-4 w-4" />
              {thumbFile ? thumbFile.name : "Choose thumbnail image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
            </label>
          </VaultField>

          <div className="flex items-center gap-3 pt-2 font-mono text-xs">
            <button type="button" onClick={onClose} className="flex-1 rounded-md border border-border px-5 py-3 uppercase tracking-widest hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-md bg-cyan-400 px-5 py-3 font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(0,255,249,0.5)] hover:brightness-110 disabled:opacity-60">
              {saving ? "Saving…" : work ? "Save Changes" : "Create Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VaultReviewForm({ review, onClose, onSaved }: { review: ClientReview | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = reviewSchema.safeParse({
      client_name: form.get("client_name"),
      client_role: form.get("client_role") ?? "",
      project_title: form.get("project_title") ?? "",
      quote: form.get("quote"),
      rating: form.get("rating"),
      status: form.get("status"),
      embed_url: form.get("embed_url") ?? "",
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSaving(true);
    try {
      let thumbnail_url = review?.thumbnail_url ?? null;
      if (thumbFile) {
        thumbnail_url = await fileToDataUrl(thumbFile);
      }

      let embed_url = parsed.data.embed_url || null;
      if (embed_url) {
        const parsedYt = parseYouTubeUrl(embed_url);
        if (parsedYt.embedUrl) embed_url = parsedYt.embedUrl;
        if (!thumbnail_url && parsedYt.thumbnailUrl) thumbnail_url = parsedYt.thumbnailUrl;
      }

      saveLocalReview({
        id: review?.id,
        client_name: parsed.data.client_name,
        client_role: parsed.data.client_role || null,
        project_title: parsed.data.project_title || null,
        quote: parsed.data.quote,
        rating: parsed.data.rating,
        status: parsed.data.status,
        embed_url,
        video_url: review?.video_url ?? null,
        thumbnail_url,
      });

      toast.success(review ? "Review updated!" : "Review added!");
      onSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass border border-primary/40 rounded-2xl p-6 md:p-8 my-8 font-mono">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-black text-primary neon-text">{review ? "Edit Review" : "New Client Review"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <VaultField label="Client name">
              <input name="client_name" required defaultValue={review?.client_name ?? ""} maxLength={120} className={vaultInputCls} />
            </VaultField>
            <VaultField label="Role / Company">
              <input name="client_role" defaultValue={review?.client_role ?? ""} maxLength={160} className={vaultInputCls} />
            </VaultField>
          </div>

          <VaultField label="Project title (optional)">
            <input name="project_title" defaultValue={review?.project_title ?? ""} maxLength={160} className={vaultInputCls} />
          </VaultField>

          <VaultField label="Review Quote">
            <textarea name="quote" required rows={3} maxLength={1000} defaultValue={review?.quote ?? ""} className={vaultInputCls + " resize-none"} />
          </VaultField>

          <div className="grid grid-cols-2 gap-4">
            <VaultField label="Rating">
              <select name="rating" required defaultValue={String(review?.rating ?? 5)} className={vaultInputCls}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
              </select>
            </VaultField>
            <VaultField label="Status">
              <select name="status" required defaultValue={review?.status ?? "published"} className={vaultInputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </VaultField>
          </div>

          <VaultField label="Video Link (optional)">
            <input name="embed_url" type="text" defaultValue={review?.embed_url ?? ""} placeholder="e.g. https://www.youtube.com/watch?v=..." className={vaultInputCls} />
          </VaultField>

          <div className="flex items-center gap-3 pt-2 font-mono text-xs">
            <button type="button" onClick={onClose} className="flex-1 rounded-md border border-border px-5 py-3 uppercase tracking-widest hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-md bg-primary px-5 py-3 font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,26,26,0.5)] hover:brightness-110 disabled:opacity-60">
              {saving ? "Saving…" : review ? "Save Changes" : "Create Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const vaultInputCls =
  "w-full rounded-md bg-black/60 border border-cyan-500/30 px-4 py-3 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50";

function VaultField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">{label}</label>
      {children}
    </div>
  );
}
