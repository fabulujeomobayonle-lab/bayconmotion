import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { InteractiveTimeline } from "@/components/InteractiveTimeline";
import { sound } from "@/components/SoundSystem";
import { Layers, Film, Sparkles, Cpu, CheckCircle2, Sliders, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Editing Services — Baycon Motion & Edit Studio" },
      { name: "description", content: "Explore Baycon's high-velocity video editing services: Talking Head FX, YouTube Masterclass, Viral Reels & Shorts, and 3D Motion Graphics." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const servicesList = [
    {
      id: "talking-head",
      title: "TALKING HEAD VIRAL EDITS",
      subtitle: "For Founders, Coaches & Content Creators",
      icon: Film,
      badge: "MOST POPULAR",
      color: "border-primary text-primary",
      features: [
        "Kinetic subtitles & animated keyword popups",
        "Pattern interrupt B-roll & sound effects",
        "Voice isolation & audio de-reverb",
        "Color LUT grading tailored to brand skin tone",
        "Thumbnails & vertical reformats (9:16 & 16:9)",
      ],
    },
    {
      id: "youtube-long",
      title: "YOUTUBE LONG-FORM MASTERCLASS",
      subtitle: "10-20 Min High Retention Documentaries",
      icon: Layers,
      color: "border-cyan-400 text-cyan-400",
      features: [
        "In-depth narrative storytelling & pacing cuts",
        "Custom 2D/3D motion graphics & charts",
        "Multi-cam angle synchronization",
        "Soundtrack mixing & ambient soundscapes",
        "Chapters, timestamps & high CTR thumbnail",
      ],
    },
    {
      id: "reels-shorts",
      title: "VERTICAL REELS & SHORTS (SCALE)",
      subtitle: "30-60 Sec High Velocity Content",
      icon: Zap,
      color: "border-purple-400 text-purple-400",
      features: [
        "Instant 3-second hook retention design",
        "Fast 0.6s cut rate for maximum scroll-stopping",
        "Trending audio track pairing & sound design",
        "Optimized for Instagram, TikTok, YouTube Shorts",
        "Bulk monthly batch delivery (10-30 videos)",
      ],
    },
    {
      id: "motion-3d",
      title: "3D MOTION GRAPHICS & VFX",
      subtitle: "High-End Visual Effects & Product Animations",
      icon: Sparkles,
      color: "border-yellow-400 text-yellow-400",
      features: [
        "Cinema 4D & After Effects 3D asset renders",
        "Cyberpunk HUD elements & wireframe tracking",
        "Product explosion shots & macro callouts",
        "Logo stings & broadcast intro intros",
        "Custom alpha channel transparent overlays",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/services" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 font-mono text-xs font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,255,249,0.3)] mb-6">
            <Sliders className="h-3.5 w-3.5" />
            <span>FULL-STACK VIDEO PRODUCTION & MOTION CAPABILITIES</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            HIGH-OCTANE <span className="text-primary neon-text">EDITING SERVICES</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            From viral TikTok shorts to 20-minute YouTube documentaries, we provide end-to-end post-production that turns passive viewers into loyal subscribers.
          </p>
        </section>

        {/* INTERACTIVE TIMELINE SIMULATOR SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-impact text-2xl sm:text-3xl text-foreground uppercase tracking-wide">
              TEST OUR <span className="text-cyan-400 neon-text">TIMELINE ENGINE</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Toggle edit layers on & off to see how each component upgrades the video preview!
            </p>
          </div>

          <InteractiveTimeline />
        </section>

        {/* SERVICES GRID */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicesList.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="group relative rounded-3xl border border-border bg-card/80 p-8 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_40px_rgba(255,26,26,0.2)] backdrop-blur-xl"
                >
                  {s.badge && (
                    <span className="absolute top-6 right-6 rounded-full bg-primary/20 px-3 py-1 font-mono text-[10px] font-bold text-primary border border-primary/40">
                      {s.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-background ${s.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">{s.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 my-6 text-xs text-muted-foreground font-sans">
                    {s.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    onMouseEnter={() => sound.playClick(650)}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold text-primary hover:underline"
                  >
                    <span>ORDER THIS SERVICE</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* SLA GUARANTEE */}
        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-8 text-center backdrop-blur-xl border-dashed">
            <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400 mb-3" />
            <h3 className="font-display text-xl font-bold text-foreground">THE BAYCON SLA GUARANTEE</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-mono max-w-xl mx-auto">
              If we don't deliver your completed edit within the agreed turnaround window, your next edit is 100% FREE. Zero excuses.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
