import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CyberCursor } from "@/components/CyberCursor";
import { PageTransitionTrigger } from "@/components/PageTransition";
import { sound } from "@/components/SoundSystem";
import { Sparkles, Terminal, Cpu, Award, Shield, CheckCircle2, Flame } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Baycon — Video Editing Studio & Story" },
      { name: "description", content: "Learn about Baycon, our editing philosophy, video production hardware arsenal, and team of senior motion graphic artists." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const hardwareArsenal = [
    { name: "NVIDIA RTX 4090 DUAL RIGS", desc: "Real-time 8K RED RAW & ProRes 422 rendering" },
    { name: "APPLE M3 MAX WORKSTATIONS", desc: "Hardware accelerated DaVinci Resolve color grading" },
    { name: "DAVINCI RESOLVE STUDIO 19", desc: "Node-based color pipeline & Fairlight audio mastering" },
    { name: "ADOBE CREATIVE CLOUD PRO", desc: "Custom After Effects 3D motion graphic workflows" },
  ];

  const team = [
    {
      name: "BAYO FABULUJE",
      role: "Lead Director & Motion Architect",
      bio: "10+ years in digital video editing, motion graphics, and viral storytelling for elite founders.",
      tag: "FOUNDER",
    },
    {
      name: "MARCUS VANCE",
      role: "Senior Colorist & VFX Lead",
      bio: "Hollywood certified DaVinci colorist specializing in sci-fi aesthetics and skin tone grade perfection.",
      tag: "VFX LEAD",
    },
    {
      name: "ELENA ROSTOVA",
      role: "Spatial Sound Designer",
      bio: "Soundscape engineer building custom sub-bass drops, riser sweeps, and pristine audio dialogs.",
      tag: "AUDIO DESIGN",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <CyberBackground />
      <CyberCursor />
      <Navbar />
      <PageTransitionTrigger pathname="/about" />

      <main className="relative z-10 pt-24 pb-16">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/50 bg-purple-500/10 px-4 py-1.5 font-mono text-xs font-bold text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] mb-6">
            <Terminal className="h-3.5 w-3.5" />
            <span>INSIDE THE BAYCON EDITING ARCHITECTURE</span>
          </div>

          <h1 className="font-impact text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-foreground">
            WE DONT JUST EDIT. <br />
            WE <span className="text-primary neon-text">ENGINEER RETENTION.</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
            Founded with a single mission: to eliminate low-retention, boring videos and empower creators with cinematic post-production that commands the feed.
          </p>
        </section>

        {/* TEAM CARDS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase tracking-wide">
              THE <span className="text-cyan-400 neon-text">EDIT CREW</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Senior video editors, motion designers, & sound engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m) => (
              <div
                key={m.name}
                onMouseEnter={() => sound.playClick(700)}
                className="group relative rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(255,26,26,0.3)] hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary/30 via-background to-cyan-500/30 border border-primary/40 flex items-center justify-center font-impact text-2xl text-primary shadow-lg">
                    {m.name.charAt(0)}
                  </div>
                  <span className="rounded bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-bold text-primary border border-primary/40">
                    {m.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {m.name}
                </h3>
                <div className="font-mono text-xs text-cyan-400 font-medium mt-0.5 mb-3">
                  {m.role}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HARDWARE & SOFTWARE ARSENAL */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-primary/40 bg-card/60 p-8 md:p-12 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-border pb-6">
              <div>
                <h2 className="font-impact text-2xl sm:text-4xl text-foreground uppercase">
                  HARDWARE & <span className="text-primary neon-text">TECH ARSENAL</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
                  Zero render lag. Pure 60 FPS timeline throughput.
                </p>
              </div>
              <Cpu className="h-10 w-10 text-primary animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {hardwareArsenal.map((h) => (
                <div key={h.name} className="flex items-start gap-4 rounded-xl border border-border/60 bg-background/50 p-5">
                  <div className="h-3 w-3 rounded-full bg-cyan-400 shrink-0 mt-1 shadow-[0_0_10px_#00fff9]" />
                  <div>
                    <div className="font-bold text-foreground text-sm">{h.name}</div>
                    <div className="text-muted-foreground mt-1">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
