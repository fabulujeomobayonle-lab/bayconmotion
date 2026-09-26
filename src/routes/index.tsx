import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { sound } from "@/components/SoundSystem";
import { useState } from "react";
import { Play, Sparkles, Zap, Flame, Shield, ArrowRight, Star, Film, Sliders, CheckCircle2, TrendingUp } from "lucide-react";
import { VideoModal, type ProjectData } from "@/components/VideoModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baycon — High Impact Video Editing & Motion Graphics Studio" },
      { name: "description", content: "Baycon delivers talking head video edits, kinetic motion graphics, viral reels, and cinematic color grading that stop the scroll." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const featuredReels: ProjectData[] = [
    {
      title: "VIRAL SAAS FOUNDER REEL",
      category: "Talking Head & Reels",
      client: "Alex Tech Founder",
      views: "2.4M Views",
      retention: "87.4%",
      cuts: "0.8s Cut Rate",
      colorLut: "Cyberpunk Neon 04",
      description: "A fast-paced, high-retention reel designed for a tech CEO. Features kinetic captions, custom sound design, and 3D UI popups.",
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
      description: "Long-form coding and tech breakdown with custom motion graphics, diagram animations, and smooth speed ramps.",
      techniques: ["Diagram FX", "B-Roll Sync", "Audio Mastering", "Speed Ramping"],
    },
    {
      title: "CRYPTO EMPIRE COMMERCIAL",
      category: "Brand Commercial",
      client: "Nexus Capital",
      views: "4.8M Views",
      retention: "91.2%",
      cuts: "0.5s Cut Rate",
      colorLut: "Matrix Emerald High-Contrast",
      description: "High-octane commercial spot for a Web3 brand. Heavy glitch transitions, sound effects, and kinetic typography.",
      techniques: ["Glitch Transitions", "3D Camera Tracking", "Custom Synth FX"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary shadow-[0_0_20px_rgba(255,26,26,0.3)] animate-pulse">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>ACCEPTED 4 NEW CREATOR CLIENTS THIS MONTH</span>
            </div>

            {/* Kinetic Title */}
            <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-foreground max-w-5xl uppercase">
              YOUR STORY. <br />
              <span className="neon-text text-primary">OUR EDIT.</span> <br />
              UNFORGETTABLE.
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
              We turn raw creator footage into scroll-stopping, multi-million-view videos. Premium talking head editing, kinetic motion graphics, and Hollywood-grade sound design.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/contact"
                onMouseEnter={() => sound.playGlitch()}
                data-cursor="START NOW"
                className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 font-display text-sm font-bold tracking-widest text-black shadow-[0_0_30px_rgba(255,26,26,0.8)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,26,26,1)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>START YOUR PROJECT</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                to="/showcase"
                onMouseEnter={() => sound.playClick(700)}
                data-cursor="MOTION LAB"
                className="flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/10 px-8 py-4 font-display text-sm font-bold tracking-widest text-cyan-400 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,249,0.3)] hover:bg-cyan-500/20 transition-all hover:scale-105"
              >
                <Sliders className="h-4 w-4" />
                <span>EXPLORE MOTION LAB</span>
              </Link>
            </div>

            {/* Stats Ticker */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl border-y border-border/80 py-6 font-mono text-center">
              <div>
                <div className="font-impact text-2xl md:text-3xl text-primary">120M+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Organic Views Generated</div>
              </div>
              <div>
                <div className="font-impact text-2xl md:text-3xl text-cyan-400">450+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Videos Edited & Rendered</div>
              </div>
              <div>
                <div className="font-impact text-2xl md:text-3xl text-purple-400">84.2%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Avg Viewer Retention Rate</div>
              </div>
              <div>
                <div className="font-impact text-2xl md:text-3xl text-emerald-400">24-48H</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Fast Turnaround SLA</div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER INTERACTIVE SLIDER SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide">
              THE BAYCON <span className="text-primary neon-text">TRANSFORMATION</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-2">
              Slide to see how we turn boring unedited video into viral retention machines.
            </p>
          </div>
          <BeforeAfterSlider />
        </section>

        {/* FEATURED WORK REELS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide">
                FEATURED <span className="text-cyan-400 neon-text">EDITS</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
                Recent client reels, YouTube long-form, & commercial spots.
              </p>
            </div>

            <Link
              to="/portfolio"
              className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>VIEW FULL PORTFOLIO →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReels.map((p) => (
              <div
                key={p.title}
                onClick={() => {
                  sound.playClick(600);
                  setSelectedProject(p);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card/80 p-5 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(255,26,26,0.3)] hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden flex items-center justify-center mb-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-background to-cyan-950/40 group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 ml-1 fill-black" />
                  </div>
                  <span className="absolute top-2 right-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-cyan-400 border border-cyan-500/30">
                    {p.views}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                    {p.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY BAYCON - CORE CAPABILITIES */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-border/80 bg-card/60 p-8 md:p-12 backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="font-impact text-3xl md:text-5xl text-foreground uppercase tracking-wide">
                BUILT FOR <span className="text-primary neon-text">HIGH ENGAGEMENT</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                Every frame, cut, and sound effect is engineered to retain viewer attention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-2xl border border-border bg-background/50">
                <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <h3 className="font-display text-base font-bold text-foreground">KINETIC CAPTIONS & SFX</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dynamic animated text popping on cue with impact sound effects that keep viewers locked on screen.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl border border-border bg-background/50">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center font-bold">
                  🎨
                </div>
                <h3 className="font-display text-base font-bold text-foreground">HOLLYWOOD COLOR GRADING</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Custom LUT color pipelines tailored for skin tone perfection, neon contrast, and moody cinematic vibes.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl border border-border bg-background/50">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/40 flex items-center justify-center font-bold">
                  🔊
                </div>
                <h3 className="font-display text-base font-bold text-foreground">SPATIAL AUDIO DESIGN</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Multi-track audio mastering with low-end bass drops, swooshes, risers, and voice isolation filters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION PORTAL */}
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-primary/60 bg-gradient-to-b from-primary/15 via-background to-background p-10 md:p-16 shadow-[0_0_60px_rgba(255,26,26,0.3)]">
            <h2 className="font-impact text-3xl sm:text-5xl text-foreground uppercase tracking-tight">
              READY TO SCALE YOUR <span className="text-primary neon-text">VIDEO CONTENT?</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground font-mono max-w-xl mx-auto">
              Get your first edited video back within 24 hours. Guaranteed quality or 100% money back.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                onMouseEnter={() => sound.playGlitch()}
                className="rounded-xl bg-primary px-8 py-4 font-display text-sm font-bold text-black shadow-[0_0_30px_rgba(255,26,26,0.8)] hover:bg-primary/90 transition-all hover:scale-105"
              >
                BOOK YOUR EDIT SESSION NOW
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <VideoModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
