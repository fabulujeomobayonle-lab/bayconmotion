import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { VideoModal, type ProjectData } from "@/components/VideoModal";
import { PastClientsSection } from "@/components/PastClientsSection";
import { sound } from "@/components/SoundSystem";
import { useEffect, useState } from "react";
import { Film, Play, Users } from "lucide-react";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { parseYouTubeUrl } from "@/utils/video";
import { getLocalWorks, isValidWork, getDeletedWorkIds, getLocalPastClients, type PastClient } from "@/utils/storage";

const supabase = supabaseTyped as unknown as {
  from: (table: string) => any;
};

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Baycon Video Editing Case Studies & Reels" },
      { name: "description", content: "Explore Baycon's portfolio of viral YouTube long-form, talking head reels, commercial spots, and motion graphics." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [dbProjects, setDbProjects] = useState<ProjectData[]>([]);
  const [pastClients, setPastClients] = useState<PastClient[]>([]);

  useEffect(() => {
    async function loadWorks() {
      const isPastClient = (w: any) => typeof w?.description === "string" && w.description.startsWith("__PAST_CLIENT::");

      const toProjectData = (w: any): ProjectData => {
        const yt = parseYouTubeUrl(w.embed_url || w.video_url);
        return {
          id: w.id,
          title: w.title,
          category: w.category || "General Editing",
          description: w.description || "",
          embedUrl: yt.embedUrl || w.embed_url,
          videoUrl: w.video_url || yt.watchUrl || w.embed_url,
          thumbnailUrl: w.thumbnail_url || yt.thumbnailUrl,
          views: "Featured Work",
          retention: "High Retention",
          cuts: "Fast Paced",
          colorLut: "Custom LUT",
          techniques: ["Motion FX", "Color Grading", "Audio Sync"],
        };
      };

      const deletedIds = getDeletedWorkIds();

      // Show local works immediately
      const localPublished = getLocalWorks()
        .filter(isValidWork)
        .filter((w) => !isPastClient(w))
        .filter((w) => !deletedIds.has(w.id))
        .filter((w) => w.status === "published");
      if (localPublished.length > 0) {
        setDbProjects(localPublished.map(toProjectData));
      }

      try {
        const { data, error } = await supabase
          .from("works")
          .select("*")
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data !== null) {
          const remoteFiltered = data
            .filter(isValidWork)
            .filter((w: any) => !isPastClient(w))
            .filter((w: any) => !deletedIds.has(w.id));
          const remoteIds = new Set(remoteFiltered.map((d: any) => d.id));

          // AUTO-SYNC: local works not in Supabase → push them now
          const allLocal = getLocalWorks().filter(isValidWork).filter((w) => !isPastClient(w)).filter((w) => !deletedIds.has(w.id));
          const unsynced = allLocal.filter((l) => !remoteIds.has(l.id));
          if (unsynced.length > 0) {
            for (const item of unsynced) {
              const { error: e } = await supabase.from("works").upsert(item);
              if (e) {
                await supabase.from("works").upsert({ ...item, category: "General Editing" });
              }
            }
            // Re-fetch so the updated list shows
            const { data: fresh } = await supabase
              .from("works")
              .select("*")
              .eq("status", "published")
              .order("sort_order", { ascending: true })
              .order("created_at", { ascending: false });
            if (fresh) {
              const draftIds = new Set(allLocal.filter((w) => w.status === "draft").map((w) => w.id));
              const valid = fresh
                .filter(isValidWork)
                .filter((w: any) => !isPastClient(w))
                .filter((w: any) => !draftIds.has(w.id))
                .filter((w: any) => !deletedIds.has(w.id));
              setDbProjects(valid.map(toProjectData));
            }
            return;
          }

          if (remoteFiltered.length > 0) {
            const draftIds = new Set(allLocal.filter((w) => w.status === "draft").map((w) => w.id));
            const valid = remoteFiltered
              .filter((w: any) => !draftIds.has(w.id))
              .filter((w: any) => !deletedIds.has(w.id));
            setDbProjects(valid.map(toProjectData));
          } else {
            setDbProjects(localPublished.map(toProjectData));
          }
        }
      } catch (err) {
        console.error("Error loading portfolio works:", err);
      }
    }

    async function loadPastClients() {
      const PAST_CLIENT_PREFIX = "__PAST_CLIENT::";
      function decodeWork(w: any): PastClient | null {
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
            status: (w.status === "published" ? "published" : "draft") as "published" | "draft",
            sort_order: w.sort_order || 0,
            created_at: w.created_at || new Date().toISOString(),
          };
        } catch {
          return null;
        }
      }

      // Show local immediately
      const localClients = getLocalPastClients().filter((c) => c.status === "published");
      setPastClients(localClients);

      // Fetch from works table (no separate past_clients table needed)
      try {
        const { data } = await supabase
          .from("works")
          .select("*")
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const remoteClients = data.map(decodeWork).filter(Boolean) as PastClient[];
          if (remoteClients.length > 0) {
            setPastClients(remoteClients);
          }
        }
      } catch (err) {
        console.warn("Supabase past_clients (works) load warning:", err);
      }
    }

    loadWorks();
    loadPastClients();
  }, []);

  const projects = dbProjects;

  const filteredProjects =
    filter === "ALL"
      ? projects
      : projects.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/portfolio" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)] mb-6">
            <Film className="h-3.5 w-3.5" />
            <span>SELECTED WORKS & CASE STUDIES</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            OUR VIDEO <span className="text-cyan-400 neon-text">SHOWCASE</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Click on any project below to watch the video, inspect frame keyframe breakdowns, cut rate metrics, and sound design layers.
          </p>
        </section>

        {/* FILTER TABS */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 p-2 backdrop-blur-xl">
            {["ALL", "Talking Head", "Motion Graphics", "Random Edit", "Business Edit"].map((category) => (
              <button
                key={category}
                onClick={() => {
                  sound.playClick(700);
                  setFilter(category);
                }}
                className={`rounded-xl px-5 py-2 font-mono text-xs font-bold transition-all ${
                  filter === category
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(255,26,26,0.6)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* PORTFOLIO GRID */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center max-w-xl mx-auto space-y-4 my-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mx-auto">
                <Film className="h-8 w-8" />
              </div>
              <h3 className="font-impact text-2xl uppercase tracking-wide text-foreground">
                PORTFOLIO EMPTY / READY FOR NEW UPLOADS
              </h3>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                All demo videos have been cleared! Your portfolio is now a clean slate. Videos you upload and set to "Published" in your Admin will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((p) => {
                const yt = parseYouTubeUrl(p.embedUrl || p.videoUrl);
                const thumb = p.thumbnailUrl || yt.thumbnailUrl;

                return (
                  <div
                    key={p.id || p.title}
                    onClick={() => {
                      sound.playClick(600);
                      setSelectedProject(p);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/90 p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_0_40px_rgba(255,26,26,0.3)] hover:-translate-y-1 backdrop-blur-xl"
                  >
                    <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center mb-4">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={p.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-background to-cyan-950 group-hover:scale-105 transition-transform duration-500" />
                      )}

                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_20px_rgba(255,26,26,0.8)] group-hover:scale-110 transition-transform">
                        <Play className="h-7 w-7 ml-1 fill-black" />
                      </div>

                      {p.views && (
                        <span className="absolute top-2 right-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[9px] font-bold text-cyan-400 border border-cyan-500/40 z-10">
                          {p.views}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-primary font-bold">
                        <span>{p.category}</span>
                        {p.retention && <span className="text-emerald-400">RETENTION: {p.retention}</span>}
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>

                      {p.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-1 font-mono text-[10px] text-cyan-400">
                        <span>PLAY VIDEO & METRICS</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PAST CLIENTS SECTION */}
        <PastClientsSection clients={pastClients} />
      </main>

      <Footer />
      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
