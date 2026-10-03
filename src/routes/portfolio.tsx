import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { VideoModal, type ProjectData } from "@/components/VideoModal";
import { sound } from "@/components/SoundSystem";
import { useEffect, useState } from "react";
import { Film, Play } from "lucide-react";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
import { parseYouTubeUrl } from "@/utils/video";
import { getLocalWorks, isValidWork } from "@/utils/storage";

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

  useEffect(() => {
    async function loadWorks() {
      const localWorks = getLocalWorks().filter(isValidWork).filter((w) => w.status === "published");
      if (localWorks.length > 0) {
        const localMapped: ProjectData[] = localWorks.map((w) => {
          const yt = parseYouTubeUrl(w.embed_url || w.video_url);
          return {
            id: w.id,
            title: w.title,
            category: w.category || "General Editing",
            description: w.description || "",
            embedUrl: w.embed_url,
            videoUrl: w.video_url,
            thumbnailUrl: w.thumbnail_url || yt.thumbnailUrl,
            views: "Featured Work",
            retention: "High Retention",
            cuts: "Fast Paced",
            colorLut: "Custom LUT",
            techniques: ["Motion FX", "Color Grading", "Audio Sync"],
          };
        });
        setDbProjects(localMapped);
      } else {
        setDbProjects([]);
      }

      try {
        const { data, error } = await supabase
          .from("works")
          .select("*")
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const validData = data.filter(isValidWork);
          if (validData.length > 0) {
            const remoteMapped: ProjectData[] = validData.map((w: any) => {
              const yt = parseYouTubeUrl(w.embed_url || w.video_url);
              return {
                id: w.id,
                title: w.title,
                category: w.category || "General Editing",
                description: w.description || "",
                embedUrl: w.embed_url,
                videoUrl: w.video_url,
                thumbnailUrl: w.thumbnail_url || yt.thumbnailUrl,
                views: "Featured Work",
                retention: "High Retention",
                cuts: "Fast Paced",
                colorLut: "Custom LUT",
                techniques: ["Motion FX", "Color Grading", "Audio Sync"],
              };
            });

            setDbProjects((prev) => {
              const allLocal = getLocalWorks();
              const draftIds = new Set(allLocal.filter((w) => w.status === "draft").map((w) => w.id));
              const validRemote = remoteMapped.filter((w) => !draftIds.has(w.id));
              const map = new Map();
              [...validRemote, ...prev].forEach((item) => map.set(item.id || item.title, item));
              return Array.from(map.values()).filter((item) => {
                const localMatch = allLocal.find((l) => l.id === item.id);
                return localMatch ? localMatch.status === "published" : true;
              });
            });
          }
        }
      } catch (err) {
        console.error("Error loading portfolio works:", err);
      }
    }
    loadWorks();
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
      </main>

      <Footer />
      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
