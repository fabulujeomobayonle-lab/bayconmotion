import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { VideoModal, type ProjectData } from "@/components/VideoModal";
import { sound } from "@/components/SoundSystem";
import { useState } from "react";
import { Film, Play, Filter, Eye, Star, TrendingUp, Sparkles } from "lucide-react";

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

  const projects: ProjectData[] = [
    {
      title: "VIRAL SAAS FOUNDER REEL",
      category: "Reels / Shorts",
      client: "Alex Tech Founder",
      views: "2.4M Views",
      retention: "87.4%",
      cuts: "0.8s Cut Rate",
      colorLut: "Cyberpunk Neon 04",
      description: "Fast-paced vertical talking head reel with kinetic captions, floating 3D browser popups, and sound FX drops.",
      techniques: ["Dynamic Subtitles", "3D UI Popups", "Sound Design", "Color LUT"],
    },
    {
      title: "YOUTUBE TECH MASTERCLASS",
      category: "YouTube Long-Form",
      client: "CodeForge Channel",
      views: "1.1M Views",
      retention: "72.0%",
      cuts: "1.4s Cut Rate",
      colorLut: "Teal & Orange Pro",
      description: "14-minute tutorial video transformed into a cinema-grade masterclass with animated code highlights and diagrams.",
      techniques: ["Diagram FX", "B-Roll Sync", "Audio Mastering", "Speed Ramping"],
    },
    {
      title: "CRYPTO EMPIRE COMMERCIAL",
      category: "Commercials",
      client: "Nexus Capital",
      views: "4.8M Views",
      retention: "91.2%",
      cuts: "0.5s Cut Rate",
      colorLut: "Matrix Emerald High-Contrast",
      description: "Aggressive, high-conversion commercial spot for a cryptocurrency trading brand with fast glitch cuts.",
      techniques: ["Glitch Transitions", "3D Camera Tracking", "Custom Synth FX"],
    },
    {
      title: "FITNESS EMPIRE RETENTION REEL",
      category: "Reels / Shorts",
      client: "Titan Fitness",
      views: "3.2M Views",
      retention: "89.5%",
      cuts: "0.6s Cut Rate",
      colorLut: "Vibrant Gold LUT",
      description: "High-energy workout reel with custom motion zoom-ins, impact sound effects, and kinetic text tracking.",
      techniques: ["Motion Zoom", "Audio Isolation", "Kinetic Tracking"],
    },
    {
      title: "AI & ROBOTICS DOCUMENTARY",
      category: "YouTube Long-Form",
      client: "Future Mind Media",
      views: "890K Views",
      retention: "78.4%",
      cuts: "1.2s Cut Rate",
      colorLut: "Blade Runner Blue",
      description: "22-minute documentary detailing the rise of AI models. Features archival footage restoration and 3D hologram titles.",
      techniques: ["Hologram Titles", "Archive Restoration", "Multitrack Audio"],
    },
    {
      title: "LUXURY BRAND LAUNCH AD",
      category: "Commercials",
      client: "Aura Fragrances",
      views: "1.9M Views",
      retention: "85.1%",
      cuts: "0.9s Cut Rate",
      colorLut: "Rich Film Grain 35mm",
      description: "Cinematic commercial edit emphasizing smooth speed ramps, macro product shots, and orchestral sound design.",
      techniques: ["35mm Film Grain", "Speed Ramping", "Orchestral Mixing"],
    },
  ];

  const filteredProjects =
    filter === "ALL" ? projects : projects.filter((p) => p.category.includes(filter));

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
            Click on any project below to inspect the frame keyframe breakdown, cut rate metrics, color grading LUTs, and sound design layers.
          </p>
        </section>

        {/* FILTER TABS */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 p-2 backdrop-blur-xl">
            {["ALL", "Reels", "YouTube", "Commercials"].map((category) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p) => (
              <div
                key={p.title}
                onClick={() => {
                  sound.playClick(600);
                  setSelectedProject(p);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/90 p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_0_40px_rgba(255,26,26,0.3)] hover:-translate-y-1 backdrop-blur-xl"
              >
                <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center mb-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-background to-cyan-950 group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_20px_rgba(255,26,26,0.8)] group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 ml-1 fill-black" />
                  </div>
                  <span className="absolute top-2 right-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[9px] font-bold text-cyan-400 border border-cyan-500/40">
                    {p.views}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-primary font-bold">
                    <span>{p.category}</span>
                    <span className="text-emerald-400">RETENTION: {p.retention}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="pt-2 flex items-center gap-1 font-mono text-[10px] text-cyan-400">
                    <span>INSPECT KEYFRAMES & METRICS</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
