import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { InteractiveMotionLab } from "@/components/InteractiveMotionLab";
import { Sliders, Sparkles, Cpu, Radio, Zap } from "lucide-react";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Motion Lab & FX Playground — Baycon" },
      { name: "description", content: "Interactive video FX playground! Adjust glitch shaders, RGB shift, particle velocity, and live sound synthesis in real-time." },
    ],
  }),
  component: ShowcasePage,
});

function ShowcasePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/showcase" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-1.5 font-mono text-xs font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,255,249,0.4)] mb-6 animate-pulse">
            <Radio className="h-3.5 w-3.5" />
            <span>INTERACTIVE REALTIME MOTION LAB v4.2</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            CRAZY MOTION <span className="text-cyan-400 neon-text">& SHADER LAB</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Drag the sliders, toggle parameters, and tap the synth keys below to manipulate real-time WebGL/Canvas shaders and audio feedback.
          </p>
        </section>

        {/* MOTION LAB COMPONENT */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <InteractiveMotionLab />
        </section>

        {/* MOTION PRESET LIBRARY HIGHLIGHTS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide">
              BAYCON <span className="text-primary neon-text">CUSTOM PRESET PACKS</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Every edit we produce uses our proprietary After Effects & Premiere Pro motion templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-base">
                💥
              </div>
              <h3 className="font-display text-base font-bold text-foreground">CYBER GLITCH VOL. 4</h3>
              <p className="text-muted-foreground leading-relaxed">
                RGB split displacement maps, pixel sorting transitions, and static burst sound FX for tech & crypto videos.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center font-bold text-base">
                ✨
              </div>
              <h3 className="font-display text-base font-bold text-foreground">KINETIC TEXT HUD</h3>
              <p className="text-muted-foreground leading-relaxed">
                Word-by-word highlighted captions with auto-tracking background pills and impact swoosh sound sync.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/40 flex items-center justify-center font-bold text-base">
                🚀
              </div>
              <h3 className="font-display text-base font-bold text-foreground">3D CAMERA RAMPING</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smooth optical flow zoom transitions, whip pans, and perspective parallax effects designed for high retention.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
