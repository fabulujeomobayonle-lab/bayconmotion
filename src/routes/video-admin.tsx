import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Video,
  Play,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Sparkles,
  Layers,
  Film,
  Cpu,
  RefreshCw,
  LogOut,
  Lock,
  ArrowRight,
  Upload,
  Link2,
  Clock,
  Flame,
  Check,
} from "lucide-react";
import { sound } from "@/components/SoundSystem";
import { parseYouTubeUrl } from "@/utils/video";
import {
  getLocalWorks,
  saveLocalWork,
  deleteLocalWork,
  toggleLocalWorkStatus,
  isValidWork,
  clearAllWorks,
  type Work,
} from "@/utils/storage";
import { VideoModal, type ProjectData } from "@/components/VideoModal";

export const Route = createFileRoute("/video-admin")({
  head: () => ({
    meta: [
      { title: "Video Admin — Baycon Motion Studio" },
      { name: "description", content: "Dedicated Video Link Manager for Baycon site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: VideoAdminPage,
});

const DEFAULT_PASSCODE = "baycon2025";
const AUTH_STORAGE_KEY = "baycon_video_admin_auth";

const CATEGORIES = [
  "Talking Head",
  "Motion Graphics",
  "Random Edit",
  "Business Edit",
  "General Editing",
] as const;

function VideoAdminPage() {
  const navigate = useNavigate();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const isMainAdmin = localStorage.getItem("baycon_admin") === "authenticated";
    const isVideoAdmin = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    return isMainAdmin || isVideoAdmin;
  });

  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Works state
  const [works, setWorks] = useState<Work[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPreview, setSelectedPreview] = useState<ProjectData | null>(null);

  // Form state for new / editing video link
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Talking Head");
  const [description, setDescription] = useState<string>("");
  const [customThumbnail, setCustomThumbnail] = useState<string>("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live parsed video info
  const parsedVideo = useMemo(() => {
    return parseYouTubeUrl(inputUrl);
  }, [inputUrl]);

  // Load works from storage
  const loadWorks = () => {
    const list = getLocalWorks().filter(isValidWork);
    setWorks(list);
  };

  const handleClearAll = () => {
    if (!window.confirm("Are you sure you want to remove ALL videos from your portfolio? This will wipe all existing videos so you can start uploading afresh.")) return;
    sound.playGlitch();
    clearAllWorks();
    setWorks([]);
    toast.success("All videos removed! Portfolio is clean and ready for fresh uploads.");
  };

  const handleSyncToCloud = async () => {
    sound.playClick(600);
    const toastId = toast.loading("Syncing local videos to Supabase cloud...");
    const local = getLocalWorks().filter(isValidWork);
    
    let successCount = 0;
    let errorCount = 0;
    let lastError = null;

    // We must import supabase dynamically or use the existing one if it's imported.
    // Let's import it at the top of the file if not already. Wait, it is imported in storage.ts, let's just import it here.
    const { supabase } = await import("@/integrations/supabase/client");

    for (const work of local) {
      const { error } = await supabase.from("works").upsert(work);
      if (error) {
        console.error("Sync error for work:", work.title, error);
        errorCount++;
        lastError = error;
      } else {
        successCount++;
      }
    }

    if (errorCount > 0) {
      sound.playGlitch();
      toast.error(`Sync failed for ${errorCount} videos. Last error: ${lastError?.message || "Unknown"}`, { id: toastId });
    } else {
      sound.playSuccess();
      toast.success(`Successfully synced ${successCount} videos to the cloud!`, { id: toastId });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWorks();
    }
  }, [isAuthenticated]);

  // Handle Passcode Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim();
    if (clean === DEFAULT_PASSCODE || clean === "baycon") {
      sound.playSuccess();
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setPasscodeError(false);
      toast.success("Access Granted! Welcome to Video Admin");
    } else {
      sound.playGlitch();
      setPasscodeError(true);
      toast.error("Incorrect Passcode. Access Denied.");
    }
  };

  const handleUnlockWithAdmin = () => {
    sound.playSuccess();
    localStorage.setItem("baycon_admin", "authenticated");
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
    toast.success("Unlocked with Admin Credential");
  };

  const handleSignOut = () => {
    sound.playClick(400);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("baycon_admin");
    setIsAuthenticated(false);
    toast.info("Locked Video Admin");
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputUrl.trim()) {
      sound.playGlitch();
      toast.error("Please enter or paste a video link");
      return;
    }

    if (!title.trim()) {
      sound.playGlitch();
      toast.error("Please enter a video title");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalEmbedUrl = parsedVideo.embedUrl || inputUrl.trim();
      const finalThumbnail =
        customThumbnail.trim() || parsedVideo.thumbnailUrl || null;

      const saved = saveLocalWork({
        id: editingId || undefined,
        title: title.trim(),
        category,
        description: description.trim() || null,
        status,
        embed_url: finalEmbedUrl,
        video_url: parsedVideo.isDirectVideo ? inputUrl.trim() : null,
        thumbnail_url: finalThumbnail,
      });

      sound.playSuccess();
      toast.success(
        editingId
          ? "Video updated and live on site!"
          : status === "published"
          ? "Video link published! Now visible on Home & Portfolio!"
          : "Video saved as Draft (hidden from site)."
      );

      // Reset form & update works list immediately
      setEditingId(null);
      setInputUrl("");
      setTitle("");
      setDescription("");
      setCustomThumbnail("");
      setStatus("published");
      setWorks(getLocalWorks());
    } catch (err: any) {
      sound.playGlitch();
      toast.error(err?.message || "Failed to save video link");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill form for editing
  const startEditing = (work: Work) => {
    sound.playClick(600);
    setEditingId(work.id);
    setInputUrl(work.embed_url || work.video_url || "");
    setTitle(work.title);
    setCategory(work.category);
    setDescription(work.description || "");
    setCustomThumbnail(work.thumbnail_url || "");
    setStatus(work.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    sound.playClick(400);
    setEditingId(null);
    setInputUrl("");
    setTitle("");
    setDescription("");
    setCustomThumbnail("");
    setStatus("published");
  };

  // Delete work
  const handleDelete = (id: string, workTitle: string) => {
    if (!window.confirm(`Delete "${workTitle}" from the site?`)) return;
    sound.playGlitch();
    deleteLocalWork(id);
    setWorks((prev) => prev.filter((w) => w.id !== id));
    toast.success("Video deleted from site");
  };

  // Toggle published status
  const handleToggleStatus = (id: string) => {
    sound.playClick(800);
    const nextStatus = toggleLocalWorkStatus(id);
    setWorks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
    toast.success(
      nextStatus === "published"
        ? "Video published! Now live on site."
        : "Video unpublished! Moved to draft."
    );
  };

  // Copy link helper
  const handleCopyLink = (url: string | null, id: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    sound.playSuccess();
    setCopiedId(id);
    toast.success("Video URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered list
  const filteredWorks = works.filter((w) => {
    const matchesCategory =
      filterCategory === "ALL" ||
      w.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const publishedCount = works.filter((w) => w.status === "published").length;
  const draftCount = works.filter((w) => w.status === "draft").length;

  // ─────────────────────────────────────────────────────────────
  // 1. PIN / PASSCODE GATE SCREEN (IF NOT UNLOCKED)
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary selection:text-black">
        {/* Ambient cyber lines */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,26,26,0.12),transparent_70%)]" />

        <div className="relative w-full max-w-md rounded-3xl border border-primary/50 bg-card/90 p-8 shadow-[0_0_60px_rgba(255,26,26,0.25)] backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary text-primary shadow-[0_0_25px_rgba(255,26,26,0.6)]">
              <Video className="h-8 w-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[10px] font-mono font-bold text-primary mb-2">
                <Lock className="h-3 w-3" />
                <span>SECURE VIDEO PORTAL</span>
              </div>
              <h1 className="font-impact text-3xl text-foreground uppercase tracking-wide">
                BAYCON <span className="text-primary neon-text">VIDEO ADMIN</span>
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Enter your passcode to manage and drop video links to the site.
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter passcode (e.g. baycon2025)"
                className={`w-full rounded-xl bg-input border ${
                  passcodeError ? "border-red-500 ring-2 ring-red-500/40" : "border-border"
                } px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40`}
              />
              <p className="text-[11px] text-muted-foreground font-mono mt-1">
                Default key: <code className="text-primary font-bold">baycon2025</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(255,26,26,0.7)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>UNLOCK VIDEO ADMIN</span>
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-card/90 px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              OR
            </span>
          </div>

          <button
            type="button"
            onClick={handleUnlockWithAdmin}
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center justify-center gap-2"
          >
            <span>One-Click Auto-Unlock with Admin Session</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </button>

          <div className="mt-8 text-center border-t border-border/60 pt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              ← Return to Site
            </Link>
            <Link to="/admin" className="hover:text-primary transition-colors">
              Full CMS Admin →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. MAIN VIDEO ADMIN DASHBOARD
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      {/* Laser header line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-cyan-400 z-50 shadow-[0_0_15px_rgba(255,26,26,0.8)]" />

      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary text-primary shadow-[0_0_20px_rgba(255,26,26,0.5)]">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-impact text-xl tracking-wider text-foreground">BAYCON</span>
                <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 font-mono text-[9px] font-bold text-primary uppercase">
                  VIDEO ADMIN
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">
                Drop video links to Portfolio & Home
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
            <Link
              to="/portfolio"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <span>View Portfolio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <span>View Home</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 font-bold text-primary hover:bg-primary hover:text-black transition-all"
            >
              <span>Full CMS</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <button
              onClick={handleSignOut}
              title="Lock Admin"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-red-400 hover:border-red-500/50 transition-all"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* STATS STRIP */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs mb-1">
              <span>Total Video Links</span>
              <Film className="h-4 w-4 text-primary" />
            </div>
            <div className="font-impact text-2xl sm:text-3xl text-foreground">
              {works.length}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs mb-1">
              <span>Live on Site</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-impact text-2xl sm:text-3xl text-emerald-400">
              {publishedCount}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs mb-1">
              <span>Drafts / Hidden</span>
              <EyeOff className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="font-impact text-2xl sm:text-3xl text-yellow-400">
              {draftCount}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs mb-1">
              <span>Sync Mode</span>
              <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            </div>
            <div className="font-mono text-sm sm:text-base font-bold text-cyan-400">
              Instant + Cloud
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. ADD / EDIT VIDEO LINK FORM
        ───────────────────────────────────────────────────────────── */}
        <section className="relative rounded-3xl border border-primary/50 bg-card/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,26,26,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/80">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[10px] font-mono font-bold text-primary mb-1">
                <Sparkles className="h-3 w-3" />
                <span>{editingId ? "EDITING EXISTING VIDEO" : "INSTANT VIDEO LINK ADDER"}</span>
              </div>
              <h2 className="font-impact text-2xl sm:text-3xl text-foreground uppercase tracking-wide">
                {editingId ? "Update Video Link" : "Put Your Video Link to the Site"}
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Paste a YouTube URL, Shorts, Vimeo, or direct MP4. It auto-previews and publishes to both Home and Portfolio!
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* VIDEO URL INPUT & LIVE PREVIEW */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase font-bold tracking-wider text-primary flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Video URL / Embed Link (YouTube, Shorts, Vimeo, MP4) *</span>
                </span>
                {parsedVideo.platform !== "unknown" && (
                  <span className="rounded bg-cyan-500/20 text-cyan-400 px-2 py-0.5 text-[10px] border border-cyan-400/30 uppercase">
                    Detected: {parsedVideo.platform}
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    // If title is empty and it's a YouTube link, give a neat suggestion
                    if (!title) {
                      const yt = parseYouTubeUrl(e.target.value);
                      if (yt.videoId) {
                        setTitle(`Video #${yt.videoId.slice(0, 6).toUpperCase()}`);
                      }
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4"
                  className="w-full rounded-2xl bg-input border border-border px-5 py-3.5 text-sm sm:text-base font-mono text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* LIVE EMBEDDED PREVIEW ACCORDION */}
              {parsedVideo.embedUrl && (
                <div className="mt-4 rounded-2xl border border-primary/40 bg-black/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5" />
                      <span>LIVE PLAYER PREVIEW (Testing how it plays)</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Plays directly on site
                    </span>
                  </div>

                  <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border bg-black">
                    {parsedVideo.isDirectVideo ? (
                      <video
                        src={inputUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={parsedVideo.embedUrl}
                        title="Video Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* TITLE & CATEGORY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIRAL SAAS FOUNDER REEL #4"
                  maxLength={120}
                  className="w-full rounded-xl bg-input border border-border px-4 py-2.5 text-sm font-sans font-bold text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-input border border-border px-4 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESCRIPTION & THUMBNAIL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground">
                  Description / Client Note (optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of the edit, pacing, keyframes, client name, etc."
                  className="w-full rounded-xl bg-input border border-border px-4 py-2.5 text-xs font-sans text-foreground resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Custom Thumbnail URL (optional)</span>
                  {parsedVideo.thumbnailUrl && !customThumbnail && (
                    <span className="text-[10px] text-emerald-400">
                      ✓ Auto-detected from YouTube
                    </span>
                  )}
                </label>
                <input
                  type="url"
                  value={customThumbnail}
                  onChange={(e) => setCustomThumbnail(e.target.value)}
                  placeholder="Leave empty to use YouTube thumbnail or paste image URL"
                  className="w-full rounded-xl bg-input border border-border px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
                <p className="text-[10px] font-mono text-muted-foreground">
                  If empty, YouTube's HD thumbnail is automatically fetched and displayed.
                </p>
              </div>
            </div>

            {/* STATUS & SUBMIT BUTTON */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-mono uppercase font-bold text-muted-foreground">
                  Status:
                </label>
                <div className="inline-flex rounded-xl border border-border bg-input p-1">
                  <button
                    type="button"
                    onClick={() => setStatus("published")}
                    className={`rounded-lg px-4 py-1.5 text-xs font-mono font-bold transition-all ${
                      status === "published"
                        ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ● Published (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("draft")}
                    className={`rounded-lg px-4 py-1.5 text-xs font-mono font-bold transition-all ${
                      status === "draft"
                        ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Draft (Hidden)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(255,26,26,0.8)] hover:scale-105 hover:shadow-[0_0_50px_rgba(255,26,26,1)] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Flame className="h-4 w-4" />
                <span>{editingId ? "SAVE & UPDATE VIDEO" : "⚡ PUBLISH VIDEO TO SITE NOW"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. CURRENT VIDEOS ON SITE (MANAGEMENT LIST)
        ───────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-impact text-2xl text-foreground uppercase tracking-wide flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                <span>VIDEOS CURRENTLY ON SITE ({filteredWorks.length})</span>
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Click "Play Test" to verify playback or click the status pill to toggle visibility.
              </p>
            </div>

            {/* ACTIONS & CATEGORY FILTER PILLS */}
            <div className="flex flex-wrap items-center gap-2">
              {works.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-lg border border-red-500/50 bg-red-950/40 px-3 py-1 font-mono text-[11px] font-bold text-red-400 hover:bg-red-900/60 hover:border-red-400 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  Clear All Videos
                </button>
              )}
              {works.length > 0 && (
                <button
                  type="button"
                  onClick={handleSyncToCloud}
                  className="rounded-lg border border-cyan-500/50 bg-cyan-950/40 px-3 py-1 font-mono text-[11px] font-bold text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Force Sync to Cloud
                </button>
              )}
              {["ALL", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick(700);
                    setFilterCategory(cat);
                  }}
                  className={`rounded-lg px-3 py-1 font-mono text-[11px] font-bold transition-all ${
                    filterCategory === cat
                      ? "bg-primary text-black shadow-[0_0_10px_rgba(255,26,26,0.5)]"
                      : "text-muted-foreground hover:text-foreground bg-card/60 border border-border"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos by title or description..."
              className="w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* VIDEOS GRID */}
          {filteredWorks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center space-y-3">
              <Film className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
              <p className="font-mono text-sm text-muted-foreground">
                No videos found matching your query.
              </p>
              <button
                onClick={() => {
                  setFilterCategory("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-mono text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const yt = parseYouTubeUrl(work.embed_url || work.video_url);
                const thumb = work.thumbnail_url || yt.thumbnailUrl;

                return (
                  <div
                    key={work.id}
                    className={`group relative rounded-2xl border ${
                      work.status === "published"
                        ? "border-border hover:border-primary/80"
                        : "border-border/40 opacity-75"
                    } bg-card/80 p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,26,26,0.2)] flex flex-col justify-between`}
                  >
                    <div>
                      {/* Video Thumbnail Box with Play Overlay */}
                      <div
                        onClick={() => {
                          sound.playClick(600);
                          setSelectedPreview({
                            id: work.id,
                            title: work.title,
                            category: work.category,
                            client: "Baycon Portfolio",
                            views: "Preview Mode",
                            retention: "88.2%",
                            cuts: "0.8s Cut Rate",
                            colorLut: "Cinema LUT",
                            description: work.description || "",
                            techniques: ["Motion FX", "Color Grading", "Audio Sync"],
                            embedUrl: work.embed_url,
                            videoUrl: work.video_url,
                            thumbnailUrl: thumb,
                          });
                        }}
                        className="relative aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center cursor-pointer mb-3 group/thumb"
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={work.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-background to-cyan-950" />
                        )}

                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black shadow-lg group-hover/thumb:scale-110 transition-transform">
                          <Play className="h-6 w-6 ml-1 fill-black" />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(work.id);
                            }}
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold border transition-all ${
                              work.status === "published"
                                ? "bg-emerald-500/90 text-black border-emerald-400"
                                : "bg-yellow-500/90 text-black border-yellow-400"
                            }`}
                          >
                            {work.status === "published" ? "● LIVE ON SITE" : "○ DRAFT"}
                          </button>
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                          <span className="rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-cyan-400 border border-cyan-500/30">
                            {work.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 mb-4">
                        <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {work.title}
                        </h4>
                        {work.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {work.description}
                          </p>
                        )}
                        {work.embed_url && (
                          <p className="font-mono text-[10px] text-muted-foreground truncate">
                            🔗 {work.embed_url}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(work.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-all ${
                            work.status === "published"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-black"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500 hover:text-black"
                          }`}
                          title={work.status === "published" ? "Click to unpublish (hide from site)" : "Click to publish (show on site)"}
                        >
                          {work.status === "published" ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditing(work)}
                          className="rounded-lg border border-border bg-background/60 px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyLink(work.embed_url || work.video_url, work.id)}
                          className="rounded-lg border border-border bg-background/60 p-1 text-muted-foreground hover:text-foreground transition-all"
                          title="Copy Video Link"
                        >
                          {copiedId === work.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {yt.watchUrl && (
                          <a
                            href={yt.watchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-border bg-background/60 p-1 text-muted-foreground hover:text-cyan-400 transition-all"
                            title="Open original video source"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(work.id, work.title)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-1 text-red-400 hover:bg-red-500 hover:text-black transition-all"
                        title="Delete video from site"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-border/60 py-6 text-center font-mono text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BAYCON MOTION STUDIO // VIDEO ADMIN v1.0</span>
          <div className="flex items-center gap-4">
            <Link to="/portfolio" className="hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/admin" className="hover:text-primary transition-colors">
              Full Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* LIVE VIDEO PREVIEW MODAL */}
      <VideoModal
        project={selectedPreview}
        onClose={() => setSelectedPreview(null)}
      />
    </div>
  );
}
