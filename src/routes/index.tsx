import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { sound } from "@/components/SoundSystem";
import { useState, useEffect } from "react";
import { Play, Sparkles, Zap, Flame, Shield, ArrowRight, Star, Film, Sliders, CheckCircle2, TrendingUp } from "lucide-react";
import { VideoModal, type ProjectData } from "@/components/VideoModal";
import { PastClientsSection } from "@/components/PastClientsSection";
import { getLocalWorks, isValidWork, getLocalPastClients, decodePastClientWork, type PastClient } from "@/utils/storage";
import { parseYouTubeUrl } from "@/utils/video";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";

const supabase = supabaseTyped as unknown as {
  from: (table: string) => any;
};

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
  const [pastClients, setPastClients] = useState<PastClient[]>([]);

  useEffect(() => {
    const local = getLocalPastClients().filter((c) => c.status === "published");
    setPastClients(local);

    (async () => {
      try {
        const { data } = await supabase
          .from("works")
          .select("*")
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          const remoteClients = data
            .map(decodePastClientWork)
            .filter(Boolean)
            .filter((c: any) => isValidWork(c)) as PastClient[];
          if (remoteClients.length > 0) {
            setPastClients(remoteClients);
          }
        }
      } catch {}
    })();
  }, []);


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
            {/* Studio Recording & Status Badge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-primary/60 bg-gradient-to-r from-primary/20 via-card/80 to-cyan-500/20 px-5 py-2 font-mono text-xs font-bold text-foreground shadow-[0_0_30px_rgba(255,0,60,0.35)] backdrop-blur-xl">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#ff003c]" />
                <span className="tracking-widest">● REC 4K60 DCI</span>
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="text-cyan-300 tracking-wider">AFTER EFFECTS & DA VINCI PRO</span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="text-emerald-400 font-semibold tracking-wider">24-48H TURNAROUND</span>
            </div>

            {/* Kinetic Title */}
            <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-foreground max-w-5xl uppercase">
              RAW FOOTAGE IN. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-cyan-400 drop-shadow-[0_0_40px_rgba(255,0,60,0.8)]">
                VIRAL EDIT OUT.
              </span> <br />
              STOP THE SCROLL.
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              We turn raw creator footage into multi-million-view retention machines. High-velocity cuts, Hollywood-grade ACES color grading, custom kinetic typography, and surgical spatial sound design.
            </p>

            {/* Quick Editing Capabilities Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] font-bold text-slate-300">
              <span className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-400 shadow-[0_0_12px_rgba(255,0,60,0.2)]">
                🎬 Talking Head Viral
              </span>
              <span className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-cyan-300 shadow-[0_0_12px_rgba(0,246,255,0.2)]">
                ⚡ 0.6s Cut Pacing
              </span>
              <span className="rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-purple-300 shadow-[0_0_12px_rgba(191,0,255,0.2)]">
                🎨 Hollywood LUTs
              </span>
              <span className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-300 shadow-[0_0_12px_rgba(0,255,102,0.2)]">
                🔊 3D Spatial Audio
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
              <Link
                to="/contact"
                onMouseEnter={() => sound.playGlitch()}
                data-cursor="START NOW"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-red-500 to-primary px-8 py-4 font-display text-sm font-black tracking-widest text-black shadow-[0_0_35px_rgba(255,0,60,0.8)] transition-all hover:scale-105 hover:shadow-[0_0_55px_rgba(255,0,60,1)] border border-red-300/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>START YOUR PROJECT</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                to="/showcase"
                onMouseEnter={() => sound.playClick(700)}
                data-cursor="MOTION LAB"
                className="flex items-center gap-2 rounded-xl border border-cyan-400/70 bg-cyan-500/15 px-8 py-4 font-display text-sm font-bold tracking-widest text-cyan-300 backdrop-blur-md shadow-[0_0_25px_rgba(0,246,255,0.4)] hover:bg-cyan-500/25 hover:border-cyan-300 transition-all hover:scale-105"
              >
                <Sliders className="h-4 w-4 text-cyan-400" />
                <span>EXPLORE MOTION LAB</span>
              </Link>
            </div>

            {/* High-Tech HUD Video Stats Console */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] font-mono text-center">
              <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/50 transition-colors">
                <div className="font-impact text-3xl md:text-4xl text-primary drop-shadow-[0_0_15px_rgba(255,0,60,0.6)]">120M+</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Organic Views Generated</div>
              </div>
              <div className="p-3 rounded-xl border border-cyan-400/20 bg-cyan-500/5 hover:border-cyan-400/50 transition-colors">
                <div className="font-impact text-3xl md:text-4xl text-cyan-300 drop-shadow-[0_0_15px_rgba(0,246,255,0.6)]">450+</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Videos Edited & Rendered</div>
              </div>
              <div className="p-3 rounded-xl border border-purple-400/20 bg-purple-500/5 hover:border-purple-400/50 transition-colors">
                <div className="font-impact text-3xl md:text-4xl text-purple-300 drop-shadow-[0_0_15px_rgba(191,0,255,0.6)]">84.2%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Avg Retention Rate</div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-400/20 bg-emerald-500/5 hover:border-emerald-400/50 transition-colors">
                <div className="font-impact text-3xl md:text-4xl text-emerald-300 drop-shadow-[0_0_15px_rgba(0,255,102,0.6)]">24-48H</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Fast Turnaround SLA</div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER INTERACTIVE SLIDER SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
              <span>● INTERACTIVE PROGRAM MONITOR</span>
            </div>
            <h2 className="font-impact text-3xl sm:text-5xl text-foreground uppercase tracking-wide">
              THE BAYCON <span className="text-primary neon-text">TRANSFORMATION</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
              Drag the timeline cursor to see how unedited raw camera files transform into high-energy, scroll-stopping videos.
            </p>
          </div>
          <BeforeAfterSlider />
        </section>

        {/* PORTFOLIO & PAST CLIENTS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <PastClientsSection clients={pastClients} />

          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-card/90 via-card/70 to-card/90 p-8 md:p-12 backdrop-blur-2xl text-center shadow-[0_0_40px_rgba(0,246,255,0.15)] hover:border-cyan-400/70 transition-all mt-12 max-w-4xl mx-auto">
            <Film className="h-10 w-10 text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,246,255,0.7)]" />
            <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide mb-3">
              VIEW OUR FULL <span className="text-cyan-400 neon-text-cyan">VIDEO SHOWCASE</span>
            </h2>
            <p className="text-sm text-slate-300 font-mono max-w-xl mx-auto mb-6">
              Explore our full collection of client reels, YouTube long-form content, and commercial spots. See exactly how we engineer videos for maximum retention.
            </p>
            
            <Link
              to="/portfolio"
              onMouseEnter={() => sound.playClick(600)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-red-500 px-8 py-4 font-display text-sm font-black tracking-widest text-black shadow-[0_0_30px_rgba(255,0,60,0.7)] hover:shadow-[0_0_45px_rgba(255,0,60,1)] transition-all hover:scale-105 border border-red-300/40"
            >
              <span>VIEW FULL PORTFOLIO</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* WHY BAYCON - CORE CAPABILITIES */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-card/70 p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary tracking-widest uppercase">
                <span>POST-PRODUCTION ARCHITECTURE</span>
              </div>
              <h2 className="font-impact text-3xl md:text-5xl text-foreground uppercase tracking-wide">
                BUILT FOR <span className="text-primary neon-text">HIGH ENGAGEMENT</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Every frame, cut, and sound effect is engineered to retain viewer attention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 p-7 rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-500/10 to-transparent hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(255,0,60,0.25)] transition-all">
                <div className="h-12 w-12 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                  ⚡
                </div>
                <h3 className="font-display text-base font-black text-white tracking-wide">01 // KINETIC CAPTIONS & SFX</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Dynamic animated text popping on cue with impact swooshes and sound effects that keep viewers locked on screen without glancing away.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-red-400 font-bold">
                  <span>● 0.6S CUT CADENCE</span>
                  <span>● HOOK RETENTION</span>
                </div>
              </div>

              <div className="space-y-4 p-7 rounded-2xl border border-cyan-400/30 bg-gradient-to-b from-cyan-500/10 to-transparent hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,246,255,0.25)] transition-all">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(0,246,255,0.4)]">
                  🎨
                </div>
                <h3 className="font-display text-base font-black text-white tracking-wide">02 // HOLLYWOOD COLOR GRADING</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Custom ACES and DaVinci Resolve color pipelines tailored for skin tone perfection, neon contrast, and moody cinematic aesthetics.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-cyan-300 font-bold">
                  <span>● ACES PIPELINE</span>
                  <span>● SKIN TONE MATRIX</span>
                </div>
              </div>

              <div className="space-y-4 p-7 rounded-2xl border border-purple-400/30 bg-gradient-to-b from-purple-500/10 to-transparent hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(191,0,255,0.25)] transition-all">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(191,0,255,0.4)]">
                  🔊
                </div>
                <h3 className="font-display text-base font-black text-white tracking-wide">03 // SPATIAL AUDIO DESIGN</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Multi-track audio mastering with low-end bass drops, swooshes, risers, and AI voice isolation filters that deliver punchy cinema acoustics.
                </p>
                <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-purple-300 font-bold">
                  <span>● 32-BIT FLOAT MIX</span>
                  <span>● SUB-BASS FOLEY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION PORTAL */}
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-primary/70 bg-gradient-to-b from-primary/20 via-card/90 to-background p-10 md:p-16 shadow-[0_0_70px_rgba(255,0,60,0.35)] backdrop-blur-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 font-mono text-[11px] font-bold text-primary mb-4">
              <span>READY TO SCALE</span>
            </div>
            <h2 className="font-impact text-3xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight">
              SCALE YOUR <span className="text-primary neon-text">VIDEO CONTENT</span>
            </h2>
            <p className="mt-4 text-sm text-slate-300 font-mono max-w-xl mx-auto leading-relaxed">
              Get your first edited video back within 24 hours. Guaranteed quality, maximum retention, or 100% money back.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                onMouseEnter={() => sound.playGlitch()}
                className="rounded-xl bg-gradient-to-r from-primary to-red-500 px-10 py-4 font-display text-sm font-black tracking-widest text-black shadow-[0_0_35px_rgba(255,0,60,0.8)] hover:shadow-[0_0_55px_rgba(255,0,60,1)] transition-all hover:scale-105 border border-red-300/50"
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
