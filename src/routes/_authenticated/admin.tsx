import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { LogOut, Trash2, ExternalLink, Youtube, MessageSquare, Star, Film, CheckCircle2 } from "lucide-react";
import { parseYouTubeUrl } from "@/utils/video";
import {
  getLocalWorks,
  saveLocalWork,
  deleteLocalWork,
  toggleLocalWorkStatus,
  getLocalReviews,
  getLocalMessages,
  toggleLocalMessageRead,
  isValidWork,
  clearAllWorks,
  type Work,
  type ClientReview,
  type ContactMessage
} from "@/utils/storage";

const supabase = supabaseTyped as unknown as { from: (table: string) => any };

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — Baycon CMS" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const CATEGORIES = ["Motion Graphics", "Talking Head", "Random Edit", "Business Edit"];

type Message = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [tab, setTab] = useState<"add_youtube" | "works" | "reviews" | "messages">("add_youtube");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWorks();
    loadMessages();
    loadReviews();
  }, []);

  async function loadWorks() {
    const local = getLocalWorks().filter(isValidWork);
    setWorks(local);
    try {
      const { data } = await supabase.from("works").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const remoteFiltered = data.filter(isValidWork);
        const localMap = new Map(local.map((l) => [l.id, l]));
        const mergedRemote = remoteFiltered.map((remote: any) => {
          const localItem = localMap.get(remote.id);
          return localItem ? { ...remote, status: localItem.status } : remote;
        });
        const remoteIds = new Set(remoteFiltered.map((d: any) => d.id));
        const unmergedLocal = local.filter((l) => !remoteIds.has(l.id));
        setWorks([...unmergedLocal, ...mergedRemote]);
      }
    } catch {}
  }

  async function loadReviews() {
    const local = getLocalReviews();
    setReviews(local);
    try {
      const { data } = await supabase.from("client_reviews").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setReviews(data as unknown as ClientReview[]);
      }
    } catch {}
  }

  async function loadMessages() {
    const local = getLocalMessages();
    setMessages(local as unknown as Message[]);
    try {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const localIds = new Set(local.map((l) => l.id));
        const remoteUnsynced = (data as unknown as Message[]).filter((d) => !localIds.has(d.id));
        setMessages([...(local as unknown as Message[]), ...remoteUnsynced]);
      }
    } catch {}
  }

  function handleSignOut() {
    localStorage.removeItem("baycon_admin");
    navigate({ to: "/auth" });
  }

  async function handleAddYouTube(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const link = form.get("youtube_link") as string;
    const title = form.get("title") as string;
    const category = form.get("category") as any;

    if (!link || !title) return toast.error("Link and title are required");

    setIsSaving(true);
    try {
      const parsedYt = parseYouTubeUrl(link);
      const embed_url = parsedYt.embedUrl || link;
      const thumbnail_url = parsedYt.thumbnailUrl || null;

      saveLocalWork({
        title,
        category,
        description: null,
        status: "published", // Instantly publish YouTube links
        embed_url,
        video_url: null,
        thumbnail_url,
      });

      toast.success("YouTube Video Added & Published!");
      (e.target as HTMLFormElement).reset();
      loadWorks();
      setTab("works");
    } catch (err: any) {
      toast.error(err.message || "Failed to add video");
    } finally {
      setIsSaving(false);
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-display text-2xl font-black neon-text">BAYCON</Link>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-mono">Workspace Admin</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <SidebarButton active={tab === "add_youtube"} onClick={() => setTab("add_youtube")} icon={<Youtube className="h-4 w-4" />} label="Add YouTube Video" />
          <SidebarButton active={tab === "works"} onClick={() => setTab("works")} icon={<Film className="h-4 w-4" />} label="Manage Portfolio" count={works.length} />
          <SidebarButton active={tab === "reviews"} onClick={() => setTab("reviews")} icon={<Star className="h-4 w-4" />} label="Client Reviews" count={reviews.length} />
          <SidebarButton active={tab === "messages"} onClick={() => setTab("messages")} icon={<MessageSquare className="h-4 w-4" />} label="Inbox" count={unreadCount || undefined} alert={unreadCount > 0} />
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-colors">
            <ExternalLink className="h-4 w-4" /> Live Site
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs uppercase tracking-widest text-red-400 hover:bg-red-950/30 transition-colors w-full text-left">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
        <div className="p-8 md:p-12 max-w-5xl mx-auto min-h-full">
          
          {tab === "add_youtube" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-6">
                  <Youtube className="h-8 w-8" />
                </div>
                <h1 className="font-impact text-4xl sm:text-5xl uppercase tracking-tight mb-3">Add YouTube Video</h1>
                <p className="text-muted-foreground font-mono text-sm max-w-xl">
                  Quickly drop a YouTube link, give it a title, and pick a category. It will instantly go live on your portfolio without any complex uploads.
                </p>
              </div>

              <form onSubmit={handleAddYouTube} className="space-y-6 max-w-2xl bg-card/40 border border-border/50 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">YouTube Link</label>
                  <input
                    name="youtube_link"
                    type="url"
                    required
                    placeholder="e.g. https://youtube.com/watch?v=..."
                    className="w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Project Title</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. MrBeast Style Edit"
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Category</label>
                    <select
                      name="category"
                      required
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer font-sans appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full rounded-xl bg-primary px-8 py-5 font-display text-sm font-bold tracking-widest text-black shadow-[0_0_30px_rgba(255,26,26,0.3)] hover:shadow-[0_0_50px_rgba(255,26,26,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSaving ? "ADDING VIDEO..." : "ADD TO PORTFOLIO"}
                    {!isSaving && <CheckCircle2 className="h-5 w-5" />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === "works" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                  <h1 className="font-impact text-4xl sm:text-5xl uppercase tracking-tight mb-2">Manage Portfolio</h1>
                  <p className="text-muted-foreground font-mono text-sm">Organize and toggle visibility of your videos.</p>
                </div>
                {works.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("Clear ALL portfolio videos?")) {
                        clearAllWorks();
                        setWorks([]);
                        toast.success("Portfolio cleared");
                      }
                    }}
                    className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
                  >
                    Clear All Videos
                  </button>
                )}
              </div>

              {works.length === 0 ? (
                <div className="border border-dashed border-border/60 rounded-3xl p-16 text-center bg-card/20 flex flex-col items-center">
                  <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-mono">No videos added yet.</p>
                  <button onClick={() => setTab("add_youtube")} className="mt-4 text-primary text-sm hover:underline font-bold">Add your first video →</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {works.map(w => (
                    <div key={w.id} className="group border border-border bg-card/40 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-video bg-black relative">
                        {w.thumbnail_url ? (
                          <img src={w.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900"><Youtube className="h-8 w-8 text-white/20" /></div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md backdrop-blur-md ${w.status === 'published' ? 'bg-primary text-black' : 'bg-black/80 text-white border border-white/20'}`}>
                            {w.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{w.category}</div>
                        <h3 className="font-bold text-foreground truncate mb-4">{w.title}</h3>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newStatus = toggleLocalWorkStatus(w.id);
                              setWorks(prev => prev.map(item => item.id === w.id ? { ...item, status: newStatus } : item));
                              toast.success(newStatus === 'published' ? 'Video Published' : 'Video Hidden');
                            }}
                            className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-border hover:bg-white/5 transition-colors"
                          >
                            {w.status === 'published' ? 'Hide' : 'Publish'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this video?")) {
                                deleteLocalWork(w.id);
                                setWorks(prev => prev.filter(item => item.id !== w.id));
                                toast.success("Video deleted");
                              }
                            }}
                            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20 bg-card/20 border border-border rounded-3xl mt-10">
              <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-impact text-3xl text-foreground uppercase">Client Reviews</h2>
              <p className="text-muted-foreground font-mono mt-2 max-w-sm mx-auto">To keep things ultra-simple, the focus right now is just on adding your YouTube videos!</p>
            </div>
          )}

          {tab === "messages" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h1 className="font-impact text-4xl sm:text-5xl uppercase tracking-tight mb-3">Client Inbox</h1>
                <p className="text-muted-foreground font-mono text-sm max-w-xl">
                  Review and manage your incoming project briefs and contact requests.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="border border-dashed border-border/60 rounded-3xl p-16 text-center bg-card/20 flex flex-col items-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-mono">No messages yet.</p>
                  <p className="text-muted-foreground/70 font-mono text-xs mt-2">When clients fill your contact form, they will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((m) => (
                    <div key={m.id} className="p-6 rounded-2xl bg-card/40 border border-border hover:border-primary/50 transition-all flex flex-col gap-4 relative overflow-hidden group">
                      {!m.is_read && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                      )}
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-foreground text-lg">{m.name}</h3>
                            {!m.is_read && <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm">New</span>}
                          </div>
                          <a href={`mailto:${m.email}`} className="text-sm font-mono text-cyan-400 hover:underline">{m.email}</a>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-white/10 text-muted-foreground text-xs font-mono px-3 py-1 rounded-full mb-1">
                            {m.project_type}
                          </span>
                          <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest mt-1">
                            {new Date(m.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">{m.message}</p>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            const newStatus = toggleLocalMessageRead(m.id);
                            setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, is_read: newStatus } : msg));
                          }}
                          className="text-xs font-bold font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
                        >
                          {m.is_read ? "Mark as Unread" : "Mark as Read"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label, count, alert }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all ${
        active 
          ? "bg-primary text-black shadow-[0_0_20px_rgba(255,26,26,0.2)]" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      <div className={`${active ? "text-black" : "text-muted-foreground"}`}>{icon}</div>
      <span className="font-display text-xs font-bold uppercase tracking-widest text-left flex-1">{label}</span>
      {count !== undefined && (
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-black/20 text-black" : alert ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground"}`}>
          {count}
        </span>
      )}
    </button>
  );
}
